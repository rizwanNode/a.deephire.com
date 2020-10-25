import LiveService from '../../services/live.service';


export class Controller {
  byParam(req, res) {
    LiveService.byParam(res.locals.companyId).then(r => {
      if (r === 400 || r === 404) return res.status(r).end();
      else if (r) return res.json(r);
      return res.status(500).end();
    });
  }

  byId(req, res) {
    LiveService.byId(req.params.liveId).then(r => {
      if (r === 400 || r === 404) return res.status(r).end();
      else if (r) return res.json(r);
      return res.status(500).end();
    });
  }

  createLiveInterviews(req, res) {
    LiveService.insert(res.locals.companyId, res.locals.email, res.locals.userProfile, req.body).then(r => res.header('Access-Control-Expose-Headers', 'Location')
      .status(201)
      .location(`/v1/live/${r._id}`)
      .json(r));
  }

  deleteComment(req, res) {
    LiveService.deleteComment(req.params.liveId, req.params.commentId).then(r => res.status(r).end());
  }

  delete(req, res) {
    LiveService.delete(req.params.liveId).then(r => res.status(r).end());
  }

  deleteRecordings(req, res) {
    LiveService.deleteRecordings(req.params.liveId).then(r => res.status(r).end());
  }

  addComment(req, res) {
    LiveService.addComment(req.params.liveId, req.body).then(r => {
      if (r === 400) return res.status(r).end();
      return res.header('Access-Control-Expose-Headers', 'Location')
        .status(201)
        .location(`/v1/live/${r._id}/comments/${r.commentId}`)
        .end();
    });
  }


  handleTwilioEvents(req, res) {
    LiveService.handleTwilio(req.body).then(r => {
      if (r === 400 || r === 404) return res.status(r).end();
      else if (r) return res.json(r);
      return res.status(500).end();
    });
  }
  putData(req, res) {
    LiveService.put(req.params.liveId, req.body).then(r => res.status(r).end());
  }
  putParticipants(req, res) {
    LiveService.putParticipant(req.params.liveId, req.body).then(r => res.status(r).end());
  }
}


export default new Controller();
