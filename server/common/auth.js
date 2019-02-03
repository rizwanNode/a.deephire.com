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
export const checkJwt = jwt({
  // Dynamically provide a signing key
  // based on the kid in the header and
  // the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://login.deephire.com/.well-known/jwks.json',
  }),

  // Validate the audience and the issuer.
  audience: 'http://a.deephire.com',
  issuer: 'https://login.deephire.com/',
  algorithms: ['RS256'],
});

export async function getEmail(accessToken) {
  const value = myCache.get(accessToken);
  if (value === undefined) {
    auth0.getProfile(accessToken);
    const { email } = await auth0.getProfile(accessToken);
    myCache.set(accessToken, email);
    l.info(`set ${email} in cache`);
    return email;
  }
  l.info(`got ${value} from cache`);
  return value;
}
