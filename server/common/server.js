import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import Express from 'express';
import * as http from 'http';
import * as os from 'os';
import * as path from 'path';
import { init } from '../api/services/db.service';
import l from './logger';
import swaggerify from './swagger';

const app = new Express();

export default class ExpressServer {
  constructor() {
    const root = path.normalize(`${__dirname}/../..`);
    app.set('appPath', `${root}client`);
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser(process.env.SESSION_SECRET));
    app.use(Express.static(`${root}/public`));
  }

  router(routes) {
    swaggerify(app, routes);
    return this;
  }

  initDb() {
    init().then(success => {
      if (success) {
        l.info('Database connected.');
      } else {
        l.error('Database failed to comnnect.');
      }
    });
    return this;
  }


  listen(port = process.env.PORT) {
    const welcome = p => () =>
      l.info(
        `up and running in ${process.env.NODE_ENV ||
          'development'} @: ${os.hostname()} on port: ${p}}`,
      );
    http.createServer(app).listen(port, welcome(port));
    return app;
  }
}
