import EventsService from '../../services/events.service';

export class Controller {
  started(req, res) {
    EventsService.started(req.body).then(r => {
      if (r === 400 || r === 404) res.status(r).end();
      else if (r) res.json(r);
      else res.status(500).end();
    });
  }

  victory(req, res) {
    EventsService.victory(req.body).then(r => {
      if (r === 400 || r === 404) res.status(r).end();
      else if (r) res.json(r);
      else res.status(500).end();
    });
  }
}
export default new Controller();
