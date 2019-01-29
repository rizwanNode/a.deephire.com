import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import { AuthenticationClient } from 'auth0';

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

export const getEmail = accessToken => {
  auth0.getProfile(accessToken, (err, userInfo) => {
    const { email } = userInfo;
    return email;
  });
};
