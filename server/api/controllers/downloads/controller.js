import DownloadsService from '../../services/downloads.service';

export class Controller {
  users(req, res) {
    DownloadsService.downloadUsers(res.locals.companyId).then(r => {
      if (r === 400 || r === 404) res.status(r).end();
      else if (r) {
        res.set('Content-Type', 'text/plain');
        res.send(r);
      } else res.status(500).end();
    });
  }
}

export default new Controller();
