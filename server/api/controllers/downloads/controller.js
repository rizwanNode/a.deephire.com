import DownloadsService from '../../services/downloads.service';

export class Controller {
  users(req, res) {
    DownloadsService.downloadUsers(res.locals.companyId).then(r => {
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
    DownloadsService.downloadJobs(res.locals.companyId, startDate, endDate).then(r => {
      if (r === 400 || r === 404) res.status(r).end();
      else if (r) {
        res.set('Content-Type', 'application/vnd.ms-excel');
        res.send(r);
      } else res.status(500).end();
    });
  }
}

export default new Controller();
