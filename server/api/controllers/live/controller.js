import LiveService from '../../services/live.service';


export class Controller {
  byParam(req, res) {
    LiveService.byParam(res.locals.companyId).then(r => {
      if (r === 400 || r === 404) res.status(r).end();
      else if (r) res.json(r);
      else res.status(500).end();
    });
  }

  byId(req, res) {
    LiveService.byId(req.params.liveInterviewId).then(r => {
      if (r === 400 || r === 404) res.status(r).end();
      else if (r) res.json(r);
      else res.status(500).end();
    });
  }

  createLiveInterviews(req, res) {
    LiveService.insert(res.locals.companyId, res.locals.email, req.body).then(r => {
      res.header('Access-Control-Expose-Headers', 'Location');
      return res
        .json(r)
        .status(201)
        .location(`/v1/live/${r._id}`)
        .end();
    });
  }

  handleTwilioEvents(req, res) {
    LiveService.handleTwilio(req.body).then(r => {
      if (r === 400 || r === 404) res.status(r).end();
      else if (r) res.json(r);
      else res.status(500).end();
    });
  }
}

export default new Controller();
