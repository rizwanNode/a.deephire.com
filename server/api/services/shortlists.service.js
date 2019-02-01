import l from '../../common/logger';
import db from './db.service';

class ShortlistService {
  all(createdBy) {
    l.info(`${this.constructor.name}.all(${createdBy}`);
    const search = { created_by: createdBy };
    return db.byParam(search, 'shortlists');
  }


  insert(data, email) {
    l.info(`${this.constructor.name}.insert(${data},${email})`);
    const shortList = { ...data, createdBy: email };
    return db.insert(shortList, 'shortlists');
  }

  byParam(id) {
    l.info(`${this.constructor.name}.byParam(${id})`);

    return db.byParam(id, 'shortlists', true);
  }
}

export default new ShortlistService();
