import * as express from 'express';
import controller from './controller';
import { checkJwt } from '../../../common/auth';

export default express
  .Router()
  .get('/', checkJwt, controller.all)
  .post('/', checkJwt, controller.create)
  .get('/:id', controller.byParam);
