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

  clicked(req, res) {
    EventsService.clicked(req.body).then(r => {
      if (r === 400 || r === 404) res.status(r).end();
      else if (r) res.json(r);
      else res.status(500).end();
    });
  }

  getEvents(req, res) {
    EventsService.getEvents(res.locals.companyId).then(r => {
      if (r instanceof Error) res.status(500).end();
      if (r === 400) res.status(r).end();
      else if (r) res.json(r);
      else res.status(500).end();
    });
  }

  getEventsById(req, res) {
    EventsService.getEventsById(res.locals.companyId, req.params.interviewId).then(r => {
      if (r instanceof Error) res.status(500).end();
      if (r === 400) res.status(r).end();
      else if (r) res.json(r);
      else res.status(500).end();
    });
  }

  getEventsPaginatedById(req, res) {
    const sort = {}
    sort[req.params.sortItem] = parseInt(req.params.sortOrder);
    EventsService.getEventsPageByID(res.locals.companyId, req.params.interviewId, req.params.page, req.params.n, sort)
    .then(r => {
      if (r instanceof Error) res.status(500).end();
      if (r === 400) res.status(r).end();
      else if (r) res.json(r);
      else res.status(500).end();
    });
  }
}
export default new Controller();
