import * as express from 'express';
import controller from './controller';


export default express
  .Router()
  .post('/victory', controller.victory)
  .post('/started', controller.started)
  .post('/clicked', controller.clicked);

