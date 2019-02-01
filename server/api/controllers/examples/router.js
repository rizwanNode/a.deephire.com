import * as express from 'express';
import controller from './controller';

export default express
  .Router()
  .post('/', controller.insert)
  .get('/', controller.all)
  .get('/:id', controller.byParam);
