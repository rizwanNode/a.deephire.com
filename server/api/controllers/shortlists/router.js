import * as express from 'express';
import controller from './controller';
import { checkJwt } from '../../../common/auth';

export default express
  .Router()
  .get('/', checkJwt, controller.all)
  .post('/', controller.update)
  .get('/:id', controller.byParam);
