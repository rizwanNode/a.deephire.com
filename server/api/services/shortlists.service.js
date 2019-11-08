import { ObjectId } from 'mongodb';
import l from '../../common/logger';
import { byParam, insert, put } from './db.service';
import { shortenLink } from '../../common/rebrandly';
import { archiveValidator } from '../../common/helpers';

class ShortlistService {
  all(companyId) {
    l.info(`${this.constructor.name}.all(${companyId}`);
    const search = { companyId: new ObjectId(companyId) };
    return byParam(search, 'shortlists');
  }

  archives(companyId) {
    l.info(`${this.constructor.name}.archives(${companyId})`);
    const search = { companyId: new ObjectId(companyId) };
    return byParam(search, 'shortlists', false, true);
  }

  async insert(data, createdBy, companyId) {
    l.info(`${this.constructor.name}.insert(${data},${createdBy}, ${companyId})`);
    const objId = ObjectId();
    const longUrl = `https://candidates.deephire.com/shortlist?shortlist=${objId.valueOf()}`;

    const shortUrl = await shortenLink(longUrl, 'share.deephire.com', `${createdBy}'s shortList for ${data.email}`);

    const shortList = { ...data, createdBy, _id: objId, shortUrl, companyId: new ObjectId(companyId) };
    return insert(shortList, 'shortlists');
  }

  byParam(id) {
    l.info(`${this.constructor.name}.byParam(${id})`);

    return byParam(id, 'shortlists', true);
  }

  put(id, data) {
    delete data._id;
    l.info(`${this.constructor.name}.put(${id}, ${data})`);
    return put(id, 'shortlists', data, true);
  }

  archive(data) {
    l.info(`${this.constructor.name}.archive(${data})`);
    return archiveValidator(data, true, 'shortlists');
  }

  unarchive(data) {
    l.info(`${this.constructor.name}.unarchive(${data})`);
    return archiveValidator(data, false, 'shortlists');
  }
}

export default new ShortlistService();
