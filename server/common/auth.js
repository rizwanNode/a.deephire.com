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

export const myCache = new NodeCache({ stdTTL: 3600, checkperiod: 240 });

export const auth0Managment = new ManagementClient({
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

    if (jwtDecode(accessToken).azp === 'Ay97b4Dqofn59Lwu9iTwwBbjke3als4D') {
      userId = 'auth0|5fc900265bddd2006e2f37d1'; // 'apple@deephire.com'
    }

    if (jwtDecode(accessToken).azp === 'HOii5rzDjw7zo0Vpjg55Aeo8Jqqy5GMM') {
      userId = 'auth0|5f7f2546ec8f030075525516'; // 'appledev@deephire.com'
    }

    if (jwtDecode(accessToken).azp === 'NjKEg91EJaEvdnNBOUb0IGaiDzA7Etuw') {
      userId = 'auth0|5fa17968d4c76b0072731f22'; // 'alliancedev@deephire.com'
    }

    if (jwtDecode(accessToken).azp === 'xuR0ynu7oPzklMzGer0w22uNCkHFOuPu') {
      userId = 'auth0|5ff34bd87e3d490075921c86'; // 'allianceabroad@deephire.com'
    }


    // END CUSTOM CODE FOR LINKING .Jobs accounts

    const userProfile = await auth0Managment
      .getUser({ id: userId, fields: 'app_metadata,email,name,user_id' })
      .catch(error => l.error(error));

    myCache.set(accessToken, userProfile);

    l.info(`set ${JSON.stringify(userProfile)} in cache`);
    res.locals.email = userProfile.email;
    res.locals.companyId = userProfile.app_metadata.companyId;
    res.locals.userProfile = userProfile;
  } else {
    l.info(`got ${JSON.stringify(value)} from cache`);

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
