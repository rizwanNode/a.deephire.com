import * as express from 'express';
import controller from './controller';
import auth from '../../../common/auth';


export default express
  .Router()
  .get('/', auth, controller.all)
  .post('/', auth, controller.insert)
  .get('/:id', controller.byParam)
  .delete('/:id', auth, controller.delete);

