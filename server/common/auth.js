import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import NodeCache from 'node-cache';
import { AuthenticationClient } from 'auth0';
import l from './logger';

const Mixpanel = require('mixpanel');

const mixpanel = Mixpanel.init(process.env.MIXPANEL_API, {
  protocol: 'https',
});

const jwtDecode = require('jwt-decode');

const myCache = new NodeCache({ stdTTL: 3600, checkperiod: 240 });

const auth0 = new AuthenticationClient({
  domain: 'login.deephire.com',
  clientId: 'jhzGFZHTv8ehpGskVKxZr_jXOAvKg7DU',
});

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://login.deephire.com/.well-known/jwks.json',
  }),
  audience: 'http://a.deephire.com',
  issuer: 'https://login.deephire.com/',
  algorithms: ['RS256'],
});

async function getEmail(req, res, next) {
  const accessToken = req.headers.authorization.split(' ')[1];
  const value = myCache.get(accessToken);
  if (value === undefined) {
    let { email } = await auth0.getProfile(accessToken);

    // START CUSTOM CODE FOR LINKING .Jobs accounts

    if (
      jwtDecode(accessToken).azp === '44QwZq2HNuPHJhDcIKKgCq75Xd6TQvaW' ||
      email === 'dkraciun@find.jobs' ||
      email === 'tcooper@find.jobs'
    ) {
      email = 'dh@find.jobs';
    }
    // END CUSTOM CODE FOR LINKING .Jobs accounts

    // START CUSTOM CODE FOR LINKING TWO RECRUITER ACCOUNTS TOGETHER
    // if (email === 'patrick@egntechnical.com') {
    //   email = 'errol@egntechnical.com';
    // }
    // END CUSTOM CODE FOR LINKING TWO RECRUITER ACCOUNTS TOGETHER

    myCache.set(accessToken, email);

    l.info(`set ${email} in cache`);
    res.locals.email = email;
  } else {
    l.info(`got ${value} from cache`);

    res.locals.email = value;
  }
  next();
}

async function logMixpanel(req, res, next) {
  const email = res.locals.email;
  const { originalUrl, method } = req;
  const eventName = `${method} ${originalUrl}`;
  mixpanel.track(eventName, { email });
  mixpanel.people.increment(email, eventName);
  mixpanel.people.set_once(email, {
    $email: email,
    $created: new Date(),
  });
  next();
}

const auth = [checkJwt, getEmail, logMixpanel];
export default auth;
