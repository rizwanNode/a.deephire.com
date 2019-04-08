import * as express from 'express';

import controller from './controller';
import auth from '../../../common/auth';


export default express
  .Router()
  .get('/:userId', controller.byParam)
  .post('/:userId/documents', auth, controller.postDocuments)
  .get('/:userId/documents/:num', controller.getDocuments)
  .delete('/:userId/documents/:id', controller.deleteDocuments)
  .put('/:userId', auth, controller.put);

