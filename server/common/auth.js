import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import NodeCache from 'node-cache';
import { ManagementClient } from 'auth0';
import l from './logger';

const Mixpanel = require('mixpanel');

const mixpanel = Mixpanel.init(process.env.MIXPANEL_API, {
  protocol: 'https'
});

const jwtDecode = require('jwt-decode');

const myCache = new NodeCache({ stdTTL: 3600, checkperiod: 240 });

const auth0Managment = new ManagementClient({
  domain: 'deephire2.auth0.com',
  clientId: 'M437SEOw0zLaSbZJAKcxV15m5njDbScr',
  clientSecret: process.env.AUTH0_MANAGMENT_SECRET,
  scope: 'read:users read:user_idp_tokens'
});

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://login.deephire.com/.well-known/jwks.json'
  }),
  audience: 'http://a.deephire.com',
  issuer: 'https://login.deephire.com/',
  algorithms: ['RS256']
});

async function getEmailandCompany(req, res, next) {
  const accessToken = req.headers.authorization.split(' ')[1];
  const value = myCache.get(accessToken);
  if (value === undefined) {
    let userId = jwtDecode(accessToken).sub;

    // START CUSTOM CODE FOR LINKING .Jobs accounts

    if (jwtDecode(accessToken).azp === '44QwZq2HNuPHJhDcIKKgCq75Xd6TQvaW') {
      userId = 'auth0|5da60c64f2b1420e45859173'; // 'dkraciun@find.jobs'
    }
    // END CUSTOM CODE FOR LINKING .Jobs accounts

    const userProfile = await auth0Managment
      .getUser({ id: userId, fields: 'app_metadata,email,name,user_id' })
      .catch(error => l.error(error));
    console.log(userProfile, 'uzerProfil');

    myCache.set(accessToken, userProfile);

    l.info(`set ${JSON.stringify(userProfile)} in cache`);
    res.locals.email = userProfile.email;
  } else {
    l.info(`got ${value} from cache`);

    res.locals.email = value.email;
    res.locals.companyId = value.app_metadata.companyId;
    res.locals.userProfile = value;
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
    $created: new Date()
  });
  next();
}

const auth = [checkJwt, getEmailandCompany, logMixpanel];
export default auth;
