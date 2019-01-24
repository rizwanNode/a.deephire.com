import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';

import examplesRouter from './api/controllers/examples/router';
import interviewsRouter from './api/controllers/interviews/router';
import candidatesRouter from './api/controllers/candidates/router';
import emailsRouter from './api/controllers/emails/router';
import companiesRouter from './api/controllers/companies/router';


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

export default function routes(app) {
  app.use('/v1/examples', checkJwt, examplesRouter);
  app.use('/v1/interviews', checkJwt, interviewsRouter);
  app.use('/v1/candidates', checkJwt, candidatesRouter);
  app.use('/v1/emails', checkJwt, emailsRouter);
  app.use('/v1/companies', checkJwt, companiesRouter);
}
