import l from '../../common/logger';
import db from './db.service';

class ShortlistService {
  all(email) {
    l.info(`${this.constructor.name}.all(${email}`);
    return db.byParam(email, 'companies');
  }

  update(data) {
    l.info(`${this.constructor.name}.update(${data})`);
    return db.updateByEmail(data, 'companies');
  }

  byId(id) {
    l.info(`${this.constructor.name}.byId(${id})`);
    return db.byParam(id, 'companies');
  }
}

export default new ShortlistService();
