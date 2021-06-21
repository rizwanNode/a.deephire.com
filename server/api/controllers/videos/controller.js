import VideoService from '../../services/videos.service';
export class Controller {
  all(req, res) {
    VideoService.all(res.locals.companyId).then(r => {
      if (r === 400 || r === 404) res.status(r).end();
      else if (r) res.json(r);
      else res.status(500).end();
    });
  }

  filter(req, res) {
    VideoService.filter(res.locals.companyId, req.query.candidateEmail).then(r => {
      if (r === 400 || r === 404) res.status(r).end();
      else if (r) res.json(r);
      else res.status(500).end();
    });
  }

  proxy(req, res) {
  

    VideoService.proxy(req.params.id).then(r => {
      const headers = r.headers.raw()
      const newHeaders = {}
      Object.keys(headers).forEach(headerKey => {(newHeaders[headerKey] = headers[headerKey][0] )})
      r.body.pipe(res).set(newHeaders)
    })
  }

  archives(req, res) {
    VideoService.archives(res.locals.companyId).then(r => {
      if (r === 400 || r === 404) res.status(r).end();
      else if (r) res.json(r);
      else res.status(500).end();
    });
  }

  insert(req, res) {
    // add auth for this endpoint, requires sending login from app
    VideoService.insert(req.body).then(id => {
      res.header('Access-Control-Expose-Headers', 'Location')
        .status(201)
        .location(`/v1/videos/${id}`)
        .end();
    });
  }

  byParam(req, res) {
    VideoService.byParam(req.params.id).then(r => {
      if (r === 400 || r === 404) res.status(r).end();
      else if (r) res.json(r);
      else res.status(500).end();
    });
  }

  delete(req, res) {
    VideoService.delete(res.locals.companyId, req.params.id).then(r => {
      res.status(r).end();
    });
  }

  deleteIndividualQuestion(req, res) {
    VideoService.deleteIndividualQuestion(req.params.id, req.params.questionId).then(r => {
      res.status(r).end();
    });
  }

  archive(req, res) {
    VideoService.archive(req.body).then(r => res.status(r).end());
  }

  unarchive(req, res) {
    VideoService.unarchive(req.body).then(r => res.status(r).end());
  }

  archiveVideo(req, res) {
    VideoService.archiveVideo(req.params.id, req.body).then(r => res.status(r).end());
  }

  unarchiveVideo(req, res) {
    VideoService.unarchiveVideo(req.params.id, req.body).then(r => res.status(r).end());
  }
}
export default new Controller();
