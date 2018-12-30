import * as express from 'express';
import controller from './controller';

export default express
  .Router()
  .get('/', controller.all)
  .delete('/:userId/:interviewId', controller.delete);

