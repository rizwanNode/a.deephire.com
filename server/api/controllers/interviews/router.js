import * as express from 'express';
import auth from '../../../common/auth';
import { all, archive, archives, byParam, insert, unarchive, put, duplicate, invite } from './controller';

export default express
  .Router()
  .get('/archives', auth, archives)
  .post('/archive', auth, archive)
  .post('/unarchive', auth, unarchive)
  .post('/duplicate', auth, duplicate)
  .post('/:id/invites', auth, invite)

  .get('/', auth, all)
  .post('/', auth, insert)
  .put('/:id', auth, put)
  .get('/:id', byParam);
// .delete('/:id', auth, deleteData);
