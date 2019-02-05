import l from '../../common/logger';
import { all, deleteObject } from './db.service';


class InterviewsService {
  all() {
    l.info(`${this.constructor.name}.all()`);
    return all('interviews');
  }

  delete(id) {
    l.info(`${this.constructor.name}.delete(${id})`);
    return deleteObject(id, 'interviews');
  }
}

export default new InterviewsService();
