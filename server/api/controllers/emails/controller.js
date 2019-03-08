import EmailsService from '../../services/emails.service';

export class Controller {
  send(req, res) {
    EmailsService.send(req.body.recipients, req.body.type, req.body).then(
      r => res.json(r),
    );
  }
}
export default new Controller();
