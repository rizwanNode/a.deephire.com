import l from '../../common/logger';
import { all, updateByEmail, byParam } from './db.service';

class CandidatesService {
  all() {
    l.info(`${this.constructor.name}.all()`);
    return all('companies');
  }

  update(data) {
    l.info(`${this.constructor.name}.add(${data})`);
    return updateByEmail(data, 'companies');
  }

  byParam(email) {
    l.info(`${this.constructor.name}.byParam(${email})`);
    const search = { email };
    return byParam(search, 'companies');
  }
}

export default new CandidatesService();
