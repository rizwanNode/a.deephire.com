import { ObjectId } from 'mongodb';
import l from '../../common/logger';
import db from './db.service';
import shortenLink from '../../common/shortenLink';

class ShortlistService {
  all(createdBy) {
    l.info(`${this.constructor.name}.all(${createdBy}`);
    const search = { created_by: createdBy };
    return db.byParam(search, 'shortlists');
  }

  async insert(data, email) {
    l.info(`${this.constructor.name}.insert(${data},${email})`);
    const objId = ObjectId();
    const longUrl = `https://candidates.deephire.com/?shortlist=${objId.valueOf()}`;

    const shortUrl = await shortenLink(longUrl, `${email}'s shortList for ${data.email}`);

    const shortList = { ...data, createdBy: email, _id: objId, shortUrl };
    return db.insert(shortList, 'shortlists');
  }

  byParam(id) {
    l.info(`${this.constructor.name}.byParam(${id})`);

    return db.byParam(id, 'shortlists', true);
  }

  put(id, data) {
    delete data._id;
    l.info(`${this.constructor.name}.put(${id}, ${data})`);
    return db.put(id, 'shortlists', data, true);
  }
}

export default new ShortlistService();
