import l from '../../common/logger';
import db from './db.service';

class CandidatesService {
  byParam(userId) {
    l.info(`${this.constructor.name}.byParam(${userId})`);
    const search = { userId };
    return db.byParam(search, 'candidates');
  }

  put(data) {
    l.info(`${this.constructor.name}.put(${data})`);
    return db.put(data, 'candidates');
  }
}


export default new CandidatesService();

