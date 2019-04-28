import * as express from 'express';
import controller from './controller';
import auth from '../../../common/auth';

export default express
  .Router()
  .get('/', auth, controller.all)
  .post('/', auth, controller.insert)
  .get('/:id', controller.byParam)
  .put('/:id', controller.put)
  .post('/archive', auth, controller.archive)
  .post('/unarchive', auth, controller.unarchive);
