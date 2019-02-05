import l from '../../common/logger';
import db from './db.service';

class CandidatesService {
  byParam(userId) {
    l.info(`${this.constructor.name}.byParam(${userId})`);
    const search = { userId };
    return db.byParam(search, 'candidates');
  }

  put(userId) {
    l.info(`${this.constructor.name}.put(${userId})`);
    return db.put({ userId }, 'candidates');
  }
}


export default new CandidatesService();

