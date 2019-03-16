import l from '../../common/logger';
import { byParam } from './db.service';

class CandidatesService {
  // update(data) {
  //   l.info(`${this.constructor.name}.add(${data})`);
  //   return updateByEmail(data, 'companies');
  // }

  byParam(email) {
    l.info(`${this.constructor.name}.byParam(${email})`);
    const search = { recruiters: email };
    return byParam(search, 'companies').then(r => r[0]);
  }
}

export default new CandidatesService();
