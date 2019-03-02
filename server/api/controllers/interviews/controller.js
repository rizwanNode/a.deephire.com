import InterviewsService from '../../services/interviews.service';

export class Controller {
  all(req, res) {
    InterviewsService.all(res.locals.email).then(r => res.json(r));
  }

  insert(req, res) {
    InterviewsService.insert(req.body, res.locals.email).then(r => {
      res
        .status(201)
        .location(`/v1/interviews/${r._id}`)
        .json(r);
    });
  }

  byParam(req, res) {
    InterviewsService.byParam(req.params.id).then(r => {
      if (r) res.json(r);
      else res.status(500).end();
    });
  }

  delete(req, res) {
    InterviewsService.delete(req.params.id).then(r => {
      res.status(r).end();
    });
  }
}
export default new Controller();
