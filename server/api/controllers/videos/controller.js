import VideoService from '../../services/videos.service';
import { getEmail } from '../../../common/auth';

export class Controller {
  async all(req, res) {
    const email = await getEmail(req.headers.authorization.split(' ')[1]);
    VideoService.all(email).then(r => res.json(r));
  }

  insert(req, res) {
    // add auth for this endpoint, requires sending login from app
    VideoService.insert(req.body).then(r => res.status(r).end());
  }

  byParam(req, res) {
    VideoService.byParam(req.params.id).then(r => {
      if (r) res.json(r);
      else res.status(500).end();
    });
  }
}
export default new Controller();
