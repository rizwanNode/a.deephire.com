import * as express from 'express';
import controller from './controller';
import auth from '../../../common/auth';

export default express
  .Router()
  .post('/invites', auth, controller.sendInvites)
  .get('/invites', auth, controller.getInvites)
  .get('/invites/:inviteId', controller.getInviteById)
  .delete('/invites/:inviteId', auth, controller.deleteInvite)
  .put('/invites/:inviteId', auth, controller.resendInvite)
  .get('/team', auth, controller.getTeam)
  .delete('/team/:teamMemberId', auth, controller.deleteTeamMember)
  .put('/logo', auth, controller.putLogo)
  .put('/', auth, controller.put)
  .post('/', controller.insert)
  .get('/:companyId', controller.byId)
  .get('/', auth, controller.byCompanyId);

