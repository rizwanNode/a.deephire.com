import l from '../../common/logger';
import db from './db.service';


class InterviewsService {
  all() {
    l.info(`${this.constructor.name}.all()`);
    return db.all('interviews');
  }

  delete(id) {
    l.info(`${this.constructor.name}.delete(${id})`);
    return db.delete(id, 'interviews');
  }
}

export default new InterviewsService();
