import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import NodeCache from 'node-cache';
import { AuthenticationClient } from 'auth0';
import l from './logger';

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
    auth0.getProfile(accessToken);
    const { email } = await auth0.getProfile(accessToken);
    myCache.set(accessToken, email);
    l.info(`set ${email} in cache`);
    res.locals.email = email;
  }
  l.info(`got ${value} from cache`);
  res.locals.email = value;
  next();
}

const auth = [checkJwt, getEmail];
export default auth;
