import * as express from 'express';

import controller from './controller';
import checkJwt from '../../../checkJwt';

export default express
  .Router()
  .get('/', checkJwt, controller.all)
  .get('/:userId/', controller.byId)
  .put('/', checkJwt, controller.put)
  .delete('/:userId/:interviewId', checkJwt, controller.delete);

