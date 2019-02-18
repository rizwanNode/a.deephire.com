import ShortlistService from '../../services/shortlists.service';

export class Controller {
  all(req, res) {
    ShortlistService.all(res.locals.email).then(r => res.json(r));
  }

  insert(req, res) {
    ShortlistService.insert(req.body, res.locals.email).then(r => {
      res
        .status(201)
        .location(`/v1/shortlists/${r._id}`)
        .json(r);
    });
  }

  byParam(req, res) {
    ShortlistService.byParam(req.params.id).then(r => {
      if (r) res.json(r);
      else res.status(500).end();
    });
  }

  put(req, res) {
    ShortlistService.put(req.params.id, req.body).then(r => {
      if (r) res.json(r);
      else res.status(500).end();
    });
  }
}
export default new Controller();
