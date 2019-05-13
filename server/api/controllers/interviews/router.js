import * as express from 'express';
import auth from '../../../common/auth';
import { all, archive, archives, byParam, insert, unarchive } from './controller';

export default express
  .Router()
  .get('/archives', auth, archives)
  .post('/archive', auth, archive)
  .post('/unarchive', auth, unarchive)
  .get('/', auth, all)
  .post('/', auth, insert)
  .get('/:id', byParam);
// .delete('/:id', auth, deleteData);

