import EmailsService from '../../services/emails.service';

export class Controller {
  send(req, res) {
    EmailsService.send(req.body.recipients, req.body.subject, req.body.message).then(
      r => res.json(r),
    );
  }
}
export default new Controller();
