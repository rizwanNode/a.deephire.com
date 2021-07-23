import * as express from 'express';
import controller from './controller';

export default express
  .Router()
  .get('/users.csv', controller.users)
  .get('/jobs.csv', controller.jobs)
  .get('/candidates.csv', controller.candidates)
  .get('/branch.csv', controller.liveBranch)
  .get('/client.csv', controller.liveClient);
