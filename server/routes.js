import examplesRouter from './api/controllers/examples/router';
import interviewsRouter from './api/controllers/interviews/router';
import candidatesRouter from './api/controllers/candidates/router';
import emailsRouter from './api/controllers/emails/router';
import companiesRouter from './api/controllers/companies/router';


export default function routes(app) {
  app.use('/v1/examples', examplesRouter);
  app.use('/v1/interviews', interviewsRouter);
  app.use('/v1/candidates', candidatesRouter);
  app.use('/v1/emails', emailsRouter);
  app.use('/v1/companies', companiesRouter);
}
