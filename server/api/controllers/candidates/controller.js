import CandidatesService from '../../services/candidates.service';

export class Controller {
  byParam(req, res) {
    CandidatesService.byParam(req.params.userId).then(r => {
      if (r) res.json(r);
      else res.status(404).end();
    });
  }

  put(req, res) {
    CandidatesService.put(req.params.userId, req.body).then(r => res.json(r));
  }

  getDocuments(req, res) {
    CandidatesService.getDocuments(req.params.userId, req.params.num)
      .then(r => r.pipe(res));
  }

  postDocuments(req, res) {
    CandidatesService.postDocuments(req.params.userId, req.files)
      .then(r => res.json(r));
  }

  deleteDocuments(req, res) {
    CandidatesService.deleteDocuments(req.params.userId, req.params.id)
      .then(r => res.json(r));
  }
}
export default new Controller();
