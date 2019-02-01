import l from '../../common/logger';

import db from './examples.db.service';

class ExamplesService {
  all() {
    l.info(`${this.constructor.name}.all()`);
    return db.all();
  }

  byParam(id) {
    l.info(`${this.constructor.name}.byParam(${id})`);
    return db.byParam(id);
  }

  insert(name) {
    return db.insert(name);
  }
}

export default new ExamplesService();
