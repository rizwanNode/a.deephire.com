import * as express from 'express';
import controller from './controller';
import auth from '../../../common/auth';

export default express
  .Router()
  .post('/', controller.insert)
  .get('/:companyId', controller.byId)
  .get('/', auth, controller.byCompanyId);
