import * as express from 'express';
import controller from './controller';
import auth from '../../../common/auth';

export default express
  .Router()
  .get('/archived', controller.archived)
  .post('/archive', auth, controller.archive)
  .post('/unarchive', auth, controller.unarchive)
  .get('/', auth, controller.all)
  .post('/', controller.insert)
  .get('/:id', controller.byParam)
  .delete('/:id', auth, controller.delete);

