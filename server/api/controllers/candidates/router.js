import * as express from 'express';

import controller from './controller';
import { checkJwt } from '../../../common/auth';

export default express
  .Router()
  .get('/:userId/', controller.byParam)
  .post('/:userId/documents/:objectKey', controller.postDocuments)
  // .post('/:userId/documents', checkJwt, controller.postDocuments)
  .put('/:userId', checkJwt, controller.put)
  .delete('/:userId/documents', checkJwt, controller.deleteDocument);

