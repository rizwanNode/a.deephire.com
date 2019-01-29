import InterviewsService from '../../services/interviews.service';
import { getEmail } from '../../../common/auth';

export class Controller {
  all(req, res) {
    getEmail(req.headers.authorization.split(' ')[1]);
    InterviewsService.all().then(r => res.json(r));
  }

  delete(req, res) {
    InterviewsService.delete(req.params.id).then(r => {
      res.status(r).end();
    });
  }
}
export default new Controller();
