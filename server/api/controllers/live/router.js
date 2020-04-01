import * as express from 'express';
import controller from './controller';
import auth from '../../../common/auth';

export default express
  .Router()
  .post('/events', controller.handleTwilioEvents)
  .get('/:liveInterviewId', auth, controller.byId)
  .get('/', auth, controller.byParam)
  .post('/', auth, controller.createLiveInterviews);

