import * as express from 'express';

import controller from './controller';
import auth from '../../../common/auth';


export default express
  .Router()
  .get('/:userId', controller.byParam)
  .post('/:userId/documents/:objectKey', auth, controller.postDocuments)
  .get('/:userId/documents/:num', auth, controller.getDocuments)
  .put('/:userId', auth, controller.put);

