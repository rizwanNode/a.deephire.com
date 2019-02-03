import * as express from 'express';
import controller from './controller';
import { checkJwt } from '../../../common/auth';

export default express
  .Router()
  .get('/', checkJwt, controller.all)
  .post('/', controller.insert)
  .get('/:id', controller.byParam)
  .delete('/:id', checkJwt, controller.delete);
