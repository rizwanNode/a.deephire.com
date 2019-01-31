import l from '../../common/logger';
import db from './db.service';

class ShortlistService {
  all(createdBy) {
    l.info(`${this.constructor.name}.all(${createdBy}`);
    const search = { created_by: createdBy };
    return db.byParam(search, 'shortlists');
  }

  update(data) {
    l.info(`${this.constructor.name}.update(${data})`);
    return db.updateByEmail(data, 'shortlists');
  }

  create(data) {
    l.info(`${this.constructor.name}.create(${data})`);
  }

  byParam(id) {
    l.info(`${this.constructor.name}.byParam(${id})`);

    return db.byParam(id, 'shortlists', true);
  }
}

export default new ShortlistService();
