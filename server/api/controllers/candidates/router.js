import * as express from 'express';
import controller from './controller';

export default express
  .Router()
  .get('/', controller.all)
  .get('/:userId/', controller.byId)
  .put('/', controller.put)
  .delete('/:userId/:interviewId', controller.delete);

