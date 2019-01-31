import ShortlistService from '../../services/shortlists.service';
import { getEmail } from '../../../common/auth';

export class Controller {
  all(req, res) {
    const email = getEmail(req.headers.authorization.split(' ')[1]);
    ShortlistService.all(email).then(r => res.json(r));
  }

  update(req, res) {
    ShortlistService.update(req.body).then(r => res.status(r).end());
  }
  byParam(req, res) {
    ShortlistService.byParam(req.params.userId).then(r => {
      if (r) res.json(r);
      else res.status(500).end();
    });
  }
}
export default new Controller();

