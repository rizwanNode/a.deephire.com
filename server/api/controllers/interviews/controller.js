import InterviewsService from '../../services/interviews.service';

export class Controller {
  all(req, res) {
    InterviewsService.all().then(r => res.json(r));
  }

  delete(req, res) {
    InterviewsService.delete(req.params.id).then(r => {
      res.status(r).end();
    });
  }
}
export default new Controller();
