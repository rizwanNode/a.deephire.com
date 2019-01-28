import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';

const checkJwt = jwt({
  // Dynamically provide a signing key
  // based on the kid in the header and
  // the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://deephire2.auth0.com/.well-known/jwks.json',
  }),

  // Validate the audience and the issuer.
  audience: 'http://a.deephire.com',
  issuer: 'https://login.deephire.com/',
  algorithms: ['RS256'],
});

export default checkJwt;
