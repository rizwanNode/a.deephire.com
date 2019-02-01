import * as express from 'express';
import controller from './controller';
import { checkJwt } from '../../../common/auth';

export default express
  .Router()
  .get('/', checkJwt, controller.all)
  .post('/', checkJwt, controller.insert)
  .get('/:id', controller.byParam);
