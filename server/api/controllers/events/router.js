import * as express from 'express';
import controller from './controller';
import auth from '../../../common/auth';

export default express
  .Router()
  .post('/victory', controller.victory)
  .post('/started', controller.started)
  .post('/clicked', controller.clicked)
  .get('/', auth, controller.getEvents)
  .get('/:interviewId', auth, controller.getEventsById)
  .get('/:interviewId/date/', auth, controller.getEventsDateRange)
  .get('/:interviewId/sort/', auth, controller.getEventsPaginatedById);

