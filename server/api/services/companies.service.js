import l from '../../common/logger';
import { insert, byId } from './db.service';

class CompaniesService {
  insert(data) {
    l.info(`${this.constructor.name}.insert(${JSON.stringify(data)})`);
    return insert(data, 'companies').then(r => r._id);
  }

  byId(companyId) {
    l.info(`${this.constructor.name}.byParam(${companyId})`);
    return byId(companyId, 'companies', true);
  }
}

export default new CompaniesService();
