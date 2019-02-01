import InterviewsService from '../../services/interviews.service';
import { getEmail } from '../../../common/auth';

export class Controller {
  async all(req, res) {
    const email = await getEmail(req.headers.authorization.split(' ')[1]);
    InterviewsService.all(email).then(r => res.json(r));
  }

  delete(req, res) {
    InterviewsService.delete(req.params.id).then(r => {
      res.status(r).end();
    });
  }
}
export default new Controller();
