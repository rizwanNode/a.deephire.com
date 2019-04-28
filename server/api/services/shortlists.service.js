import { ObjectId } from 'mongodb';
import l from '../../common/logger';
import { byParam, insert, put } from './db.service';
import { shortenLink } from '../../common/rebrandly';
import { archiveValidator } from '../../common/helpers';

class ShortlistService {
  all(createdBy) {
    l.info(`${this.constructor.name}.all(${createdBy}`);
    const search = { createdBy };
    return byParam(search, 'shortlists');
  }

  archived(createdBy) {
    l.info(`${this.constructor.name}.archived(${createdBy})`);
    const search = { createdBy };
    return byParam(search, 'shortlists', false, true);
  }

  async insert(data, createdBy) {
    l.info(`${this.constructor.name}.insert(${data},${createdBy})`);
    const objId = ObjectId();
    const longUrl = `https://candidates.deephire.com/shortlist?shortlist=${objId.valueOf()}`;

    const shortUrl = await shortenLink(longUrl, `${createdBy}'s shortList for ${data.email}`);

    const shortList = { ...data, createdBy, _id: objId, shortUrl };
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
