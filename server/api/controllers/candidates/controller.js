import CandidatesService from '../../services/candidates.service';

export class Controller {
  all(req, res) {
    CandidatesService.all().then(r => res.json(r));
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
