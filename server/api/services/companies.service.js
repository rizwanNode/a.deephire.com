import l from '../../common/logger';
import { byParam, insert } from './db.service';

class CompaniesService {
  insert(data) {
    l.info(`${this.constructor.name}.insert(${data})`);
    return insert(data, 'companies').then(r => r._id);
  }

  byParam(email) {
    l.info(`${this.constructor.name}.byParam(${email})`);
    const search = { recruiters: email };
    return byParam(search, 'companies').then(r => r[0]);
  }
}

export default new CompaniesService();
