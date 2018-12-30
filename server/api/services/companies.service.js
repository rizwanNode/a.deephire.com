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

  byEmail(email) {
    l.info(`${this.constructor.name}.byEmail(${email})`);
    return db.byEmail(email, 'companies');
  }
}

export default new CandidatesService();
