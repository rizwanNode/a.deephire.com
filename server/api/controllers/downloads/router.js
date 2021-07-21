import * as express from 'express';
import controller from './controller';
import auth from '../../../common/auth';

export default express
  .Router()
  .get('/users.csv', auth, controller.users)
  .get('/jobs.csv', auth, controller.jobs)
  .get('/candidates.csv', auth, controller.candidates);
