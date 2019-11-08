import ShortlistService from '../../services/shortlists.service';

export class Controller {
  all(req, res) {
    ShortlistService.all(res.locals.email).then(r => {
      if (r === 400 || r === 404) res.status(r).end();
      else if (r) res.json(r);
      else res.status(500).end();
    });
  }

  archives(req, res) {
    ShortlistService.archives(res.locals.email).then(r => {
      if (r === 400 || r === 404) res.status(r).end();
      else if (r) res.json(r);
      else res.status(500).end();
    });
  }

  insert(req, res) {
    ShortlistService.insert(req.body, res.locals.email, res.locals.companyId).then(r => {
      res
        .status(201)
        .location(`/v1/shortlists/${r._id}`)
        .json(r);
    });
  }

  byParam(req, res) {
    ShortlistService.byParam(req.params.id).then(r => {
      if (r === 400 || r === 404) res.status(r).end();
      else if (r) res.json(r);
      else res.status(500).end();
    });
  }

  put(req, res) {
    ShortlistService.put(req.params.id, req.body).then(r => {
      if (r) res.json(r);
      else res.status(500).end();
    });
  }
  archive(req, res) {
    ShortlistService.archive(req.body).then(r => res.status(r).end());
  }

  unarchive(req, res) {
    ShortlistService.unarchive(req.body).then(r => res.status(r).end());
  }
}
export default new Controller();
