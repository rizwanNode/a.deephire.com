import CandidatesService from '../../services/candidates.service';

export class Controller {
  byParam(req, res) {
    CandidatesService.byParam(req.params.userId).then(r => {
      if (r) res.json(r);
      else res.status(200).end();
    });
  }


  put(req, res) {
    console.log('put candidate controller');
    CandidatesService.put(req.params.userId, req.body).then(r => res.json(r));
  }

  // postDocuments(req, res) {
  //   console.log('post documents controller');
  //   CandidatesService.postDocuments(req.params.userId, req.body)
  //     .then(r => res.json(r));
  // }

  postDocuments(req, res) {
    console.log('hit othe rpost document from action');
    CandidatesService.postDocuments(req.params.userId, req.params.objectKey, req.body)
      .then(r => res.json(r));
  }

  deleteDocument(req, res) {
    console.log('delete document controller');
    CandidatesService.deleteDocument(req.params.userId, req.body)
      .then(r => res.json(r));
  }
}
export default new Controller();
