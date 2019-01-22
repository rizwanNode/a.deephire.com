import CandidatesService from '../../services/candidates.service';

export class Controller {
  all(req, res) {
    CandidatesService.all().then(r => res.json(r));
  }

  byId(req, res) {
    CandidatesService.byId(req.params.userId).then(r => {
      if (r) res.json(r);
      else res.status(200).end();
    });
  }


  put(req, res) {
    CandidatesService.put(req.body).then(r => res.json(r));
  }

  delete(req, res) {
    CandidatesService.delete(req.params.userId, req.params.interviewId).then(
      r => {
        res.status(r).end();
      },
    );
  }
}
export default new Controller();
