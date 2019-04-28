import { ObjectId } from 'mongodb';
import l from '../../common/logger';
import { deleteObject, byParam, insert } from './db.service';
import { shortenLink } from '../../common/rebrandly';
import { archiveValidator } from '../../common/helpers';

class InterviewsService {
  all(createdBy) {
    l.info(`${this.constructor.name}.all(${createdBy})`);
    const search = { createdBy };
    return byParam(search, 'interviews_test');
  }

  archived(createdBy) {
    l.info(`${this.constructor.name}.archived(${createdBy})`);
    const search = { createdBy };
    return byParam(search, 'interviews', false, true);
  }

  async insert(data, createdBy) {
    l.info(`${this.constructor.name}.insert(${data},${createdBy})`);
    const objId = ObjectId();
    const longUrl = `https://interviews.deephire.com/?id=${objId.valueOf()}`;
    const shortUrl = await shortenLink(longUrl, `${createdBy}'s interview ${data.interviewName}`);
    const pin = Math.floor(Math.random() * 90000) + 10000;
    const shortList = { ...data, createdBy, _id: objId, shortUrl, pin };
    return insert(shortList, 'interviews_test');
  }

  byParam(id) {
    l.info(`${this.constructor.name}.byParam(${id})`);
    return byParam(id, 'interviews', true);
  }

  delete(id) {
    l.info(`${this.constructor.name}.delete(${id})`);
    return deleteObject(id, 'interviews');
  }

  archive(data) {
    l.info(`${this.constructor.name}.archive(${data})`);
    return archiveValidator(data, true, 'interviews');
  }

  unarchive(data) {
    l.info(`${this.constructor.name}.unarchive(${data})`);
    return archiveValidator(data, false, 'interviews');
  }
}

export default new InterviewsService();
