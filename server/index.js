import './common/env';
import Server from './common/server';
import routes from './routes';
import l from './common/logger';

export default new Server()
  .router(routes)
  .initDb().then(server => {
    server.listen(process.env.PORT);
  })
  .catch(l.error);
