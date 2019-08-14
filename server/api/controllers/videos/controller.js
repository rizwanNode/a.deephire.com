import VideoService from '../../services/videos.service';

export class Controller {
  all(req, res) {
    VideoService.all(res.locals.email).then(r => {
      if (r === 400 || r === 404) res.status(r).end();
      else if (r) res.json(r);
      else res.status(500).end();
    });
  }

  filter(req, res) {
    VideoService.filter(res.locals.email, req.query.candidateEmail).then(r => {
      if (r === 400 || r === 404) res.status(r).end();
      else if (r) res.json(r);
      else res.status(500).end();
    });
  }

  archives(req, res) {
    VideoService.archives(res.locals.email).then(r => {
      if (r === 400 || r === 404) res.status(r).end();
      else if (r) res.json(r);
      else res.status(500).end();
    });
  }

  insert(req, res) {
    // add auth for this endpoint, requires sending login from app
    VideoService.insert(req.body).then(id => {
      res.header('Access-Control-Expose-Headers', 'Location');
      return res
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
    VideoService.delete(req.params.id).then(r => {
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
