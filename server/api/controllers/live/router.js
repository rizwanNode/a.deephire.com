import * as express from 'express';
import controller from './controller';
import auth from '../../../common/auth';

export default express
  .Router()
  .post('/events', controller.handleTwilioEvents)
  .delete('/:liveId/comments/:commentId', auth, controller.deleteComment)
  .post('/:liveId/comments', auth, controller.addComment)
  .get('/:liveId', controller.byId)
  .put('/:liveId', controller.putData)
  .get('/', auth, controller.byParam)
  .post('/', auth, controller.createLiveInterviews);

