import l from '../../common/logger';
import { byParam, put } from './db.service';

class CandidatesService {
  byParam(userId) {
    l.info(`${this.constructor.name}.byParam(${userId})`);
    const search = { userId };
    return byParam(search, 'candidates');
  }

  put(data) {
    l.info(`${this.constructor.name}.put(${data})`);
    const { userId } = data;
    const search = { userId };
    return put({ search }, 'candidates', data);
  }
}

export default new CandidatesService();
