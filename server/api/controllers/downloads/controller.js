import DownloadsService from '../../services/downloads.service';

export class Controller {
  users(req, res) {
    DownloadsService.downloadUsers(req.query.id).then(r => {
      if (r === 400 || r === 404) res.status(r).end();
      else if (r) {
        res.set('Content-Type', 'application/vnd.ms-excel');
        res.send(r);
      } else res.status(500).end();
    });
  }

  jobs(req, res) {
    const startDate = req.query?.startDate ? parseInt(req.query.startDate, 10) : 0;
    const endDate = req.query?.endDate ? parseInt(req.query.endDate, 10) : Date.now();
    DownloadsService.downloadJobs(req.query.id, startDate, endDate).then(r => {
      if (r === 400 || r === 404) res.status(r).end();
      else if (r) {
        res.set('Content-Type', 'application/vnd.ms-excel');
        res.send(r);
      } else res.status(500).end();
    });
  }

  candidates(req, res) {
    const startDate = req.query?.startDate ? parseInt(req.query.startDate, 10) : 0;
    const endDate = req.query?.endDate ? parseInt(req.query.endDate, 10) : Date.now();
    DownloadsService.getCandidates(req.query.id, startDate, endDate).then(r => {
      if (r === 400 || r === 404) res.status(r).end();
      else if (r) {
        res.set('Content-Type', 'application/vnd.ms-excel');
        res.send(r);
      } else res.status(500).end();
    });
  }

  liveBranch(req, res) {
    const startDate = req.query?.startDate ? parseInt(req.query.startDate, 10) : 0;
    const endDate = req.query?.endDate ? parseInt(req.query.endDate, 10) : Date.now();
    DownloadsService.youCandidate(req.query.id, startDate, endDate).then(r => {
      if (r === 400 || r === 404) res.status(r).end();
      else if (r) {
        res.set('Content-Type', 'application/vnd.ms-excel');
        res.send(r);
      } else res.status(500).end();
    });
  }

  liveClient(req, res) {
    const startDate = req.query?.startDate ? parseInt(req.query.startDate, 10) : 0;
    const endDate = req.query?.endDate ? parseInt(req.query.endDate, 10) : Date.now();
    DownloadsService.clientCandidate(req.query.id, startDate, endDate).then(r => {
      if (r === 400 || r === 404) res.status(r).end();
      else if (r) {
        res.set('Content-Type', 'application/vnd.ms-excel');
        res.send(r);
      } else res.status(500).end();
    });
  }
}

export default new Controller();
