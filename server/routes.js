import examplesRouter from './api/controllers/examples/router';
import interviewsRouter from './api/controllers/interviews/router';
import candidatesRouter from './api/controllers/candidates/router';
import emailsRouter from './api/controllers/emails/router';
import companiesRouter from './api/controllers/companies/router';
import shortlistsRouter from './api/controllers/shortlists/router';
import videosRouter from './api/controllers/videos/router';

import auth from './common/auth';

export default function routes(app) {
  app.use('/v1/examples', examplesRouter);
  app.use('/v1/interviews', interviewsRouter);
  app.use('/v1/candidates', candidatesRouter);
  app.use('/v1/emails', emailsRouter);
  app.use('/v1/companies', auth, companiesRouter);
  app.use('/v1/shortlists', shortlistsRouter);
  app.use('/v1/videos', videosRouter);
}
