import './common/env';
import Server from './common/server';
import routes from './routes';

const Sentry = require('@sentry/node');

Sentry.init({ dsn: 'https://ba050977b865461497954ae331877145@sentry.io/5187820' });
export default new Server()
  .router(routes)
  .initDb().listen(process.env.PORT);

