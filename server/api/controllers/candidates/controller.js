import CandidatesService from '../../services/candidates.service';

export class Controller {
  byParam(req, res) {
    CandidatesService.byParam(req.params.userId).then(r => {
      if (r === 400 || r === 404) res.status(r).end();
      else if (r) res.json(r);
      else res.status(500).end();
    });
  }

  put(req, res) {
    CandidatesService.put(req.params.userId, req.body).then(r => res.json(r));
  }

  getDocuments(req, res) {
    CandidatesService.getDocuments(req.params.userId, req.params.id).then(r => {
      if (r && r.file) {
        res.set('Content-Disposition', `filename=${encodeURI(r.fileName)}`);
        return r.file.pipe(res);
      }
      res.status(404).end();
    });
  }

  postDocuments(req, res) {
    CandidatesService.postDocuments(req.params.userId, req.files).then(r =>
      res.json(r)
    );
  }

  deleteDocuments(req, res) {
    CandidatesService.deleteDocuments(req.params.userId, req.params.id).then(
      r => res.status(r).end()
    );
  }
}
export default new Controller();
