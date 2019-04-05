import CandidatesService from '../../services/candidates.service';

export class Controller {
  byParam(req, res) {
    CandidatesService.byParam(req.params.userId).then(r => {
      if (r) res.json(r);
      else res.status(200).end();
    });
  }

  put(req, res) {
    CandidatesService.put(req.params.userId, req.body).then(r => res.json(r));
  }

  getDocuments(req, res) {
    CandidatesService.getDocuments(req.params.userId, req.params.num)
      .then(r => res.json(r));
  }

  postDocuments(req, res) {
    CandidatesService.postDocuments(req.params.userId, req.files)
      .then(r => res.json(r));
  }
}
export default new Controller();
