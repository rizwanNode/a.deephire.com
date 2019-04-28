import * as express from 'express';
import auth from '../../../common/auth';
import { all, insert, byParam, deleteData, archive, unarchive, archives } from './controller';

export default express
  .Router()
  .get('/archives', archives)
  .post('/archive', auth, archive)
  .post('/unarchive', auth, unarchive)
  .get('/', auth, all)
  .post('/', auth, insert)
  .get('/:id', byParam)
  .delete('/:id', auth, deleteData);

