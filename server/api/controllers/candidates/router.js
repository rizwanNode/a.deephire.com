import * as express from 'express';
import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';

import controller from './controller';

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://deephire2.auth0.com/.well-known/jwks.json',
  }),

  audience: 'http://a.deephire.com',
  issuer: 'https://login.deephire.com/',
  algorithms: ['RS256'],
});

export default express
  .Router()
  .get('/', checkJwt, controller.all)
  .get('/:userId/', controller.byId)
  .put('/', checkJwt, controller.put)
  .delete('/:userId/:interviewId', checkJwt, controller.delete);

