import * as express from 'express';
import controller from './controller';
import auth from '../../../common/auth';

export default express
  .Router()
  .post('/invites', auth, controller.sendInvites)
  .get('/invites', auth, controller.getInvites)
  // .delete('/invites/:inviteId', auth, controller.deleteInvite)
  .get('/team', auth, controller.getTeam)
  // .delete('/team/:teamMemberId', auth, controller.getTeam)
  .put('/logo', auth, controller.putLogo)
  .put('/', auth, controller.put)
  .post('/', controller.insert)
  .get('/:companyId', controller.byId)
  .get('/', auth, controller.byCompanyId);

