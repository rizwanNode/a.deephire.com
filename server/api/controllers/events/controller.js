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

  getEventSummaryById(req, res) {
    const startDate = parseInt(req.query.startDate);
    const endDate = parseInt(req.query.endDate);
    EventsService.getEventsSummaryById(res.locals.companyId, req.params.interviewId, startDate, endDate).then(r => {
      if (r instanceof Error) res.status(500).end();
      if (r === 400) res.status(r).end();
      else if (r) res.json(r);
      else res.status(500).end();
    });
  }

  getEventsPaginatedById(req, res) {
    const sort = {}
    if (req.query?.sortItem && req.query?.sortOrder) {
      sort[req.query.sortItem] = parseInt(req.query.sortOrder);
    }
    if (!req.query?.page || !req.query?.limit) {
      res.status(400).end();
      return;
    }
    EventsService.getEventsPageByID(res.locals.companyId, req.params.interviewId, req.query.page, req.query.limit, sort)
    .then(r => {
      if (r instanceof Error) res.status(500).end();
      if (r === 400) res.status(r).end();
      else if (r) res.json(r);
      else res.status(500).end();
    });
  }

  getEventsDateRange(req, res) {
    if (!req.query.startDate || !req.query.endDate) {
      res.status(400).end();
      return;
    }
    const startDate = parseInt(req.query.startDate);
    const endDate = parseInt(req.query.endDate);
    EventsService.getEventsDateRange(res.locals.companyId, req.params.interviewId, startDate, endDate)
    .then(r => {
      if (r instanceof Error) res.status(500).end();
      if (r === 400) res.status(r).end();
      else if (r) res.json(r);
      else res.status(500).end();
    });
  }
}
export default new Controller();
