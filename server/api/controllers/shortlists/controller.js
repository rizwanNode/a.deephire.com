import ShortlistService from '../../services/shortlists.service';
import { getEmail } from '../../../common/auth';

export class Controller {
  all(req, res) {
    const emailPromise = getEmail(req.headers.authorization.split(' ')[1]);
    emailPromise.then(email => ShortlistService.all(email).then(r => res.json(r)));
  }

  insert(req, res) {
    const emailPromise = getEmail(req.headers.authorization.split(' ')[1]);
    emailPromise.then(email =>
      ShortlistService.insert(req.body, email).then(r => {
        res
          .status(201)
          .location(`/v1/shortlists/${r._id}`)
          .json(r);
      }),
    );
  }

  byParam(req, res) {
    ShortlistService.byParam(req.params.id).then(r => {
      if (r) res.json(r);
      else res.status(500).end();
    });
  }
}
export default new Controller();
