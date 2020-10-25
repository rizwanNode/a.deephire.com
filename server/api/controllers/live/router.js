import * as express from 'express';
import controller from './controller';
import auth from '../../../common/auth';

export default express
  .Router()
  .post('/events', controller.handleTwilioEvents)
  .delete('/:liveId/comments/:commentId', auth, controller.deleteComment)
  .post('/:liveId/comments', auth, controller.addComment)
  .delete('/:liveId/recordings', auth, controller.deleteRecordings)
  .put('/:liveId/participants', controller.putParticipants)
  .get('/:liveId', controller.byId)
  .put('/:liveId', auth, controller.putData)
  .delete('/:liveId', auth, controller.delete)
  .get('/', auth, controller.byParam)
  .post('/', auth, controller.createLiveInterviews);

