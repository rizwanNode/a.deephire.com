import examplesRouter from './api/controllers/examples/router';
import interviewsRouter from './api/controllers/interviews/router';
import candidatesRouter from './api/controllers/candidates/router';
import emailsRouter from './api/controllers/emails/router';
import companiesRouter from './api/controllers/companies/router';
import shortlistsRouter from './api/controllers/shortlists/router';
import videosRouter from './api/controllers/videos/router';
import filesRouter from './api/controllers/files/router';
import eventsRouter from './api/controllers/events/router';
import profilesRouter from './api/controllers/profiles/router';
import liveRouter from './api/controllers/live/router';


// import auth from './common/auth';

export default function routes(app) {
  app.use('/v1/examples', examplesRouter);
  app.use('/v1/interviews', interviewsRouter);
  app.use('/v1/candidates', candidatesRouter);
  app.use('/v1/emails', emailsRouter);
  app.use('/v1/companies', companiesRouter);
  app.use('/v1/shortlists', shortlistsRouter);
  app.use('/v1/videos', videosRouter);
  app.use('/v1/files', filesRouter);
  app.use('/v1/events', eventsRouter);
  app.use('/v1/profiles', profilesRouter);
  app.use('/v1/live', liveRouter);
}
