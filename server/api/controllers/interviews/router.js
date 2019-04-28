import * as express from 'express';
import auth from '../../../common/auth';
import { all, insert, byParam, deleteData, archive, unarchive } from './controller';


export default express
  .Router()
  .get('/', auth, all)
  .post('/', auth, insert)
  .get('/:id', byParam)
  .delete('/:id', auth, deleteData)
  .post('/archive', auth, archive)
  .post('/unarchive', auth, unarchive);

