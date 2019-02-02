import l from '../../common/logger';
import db from './db.service';

class CandidatesService {
  all() {
    l.info(`${this.constructor.name}.all()`);
    return db.all('companies');
  }

  update(data) {
    l.info(`${this.constructor.name}.add(${data})`);
    return db.updateByEmail(data, 'companies');
  }

  byParam(email) {
    l.info(`${this.constructor.name}.byParam(${email})`);
    const search = { email };
    return db.byParam(search, 'companies');
  }
}

export default new CandidatesService();
