import { ObjectId } from 'mongodb';
import { archiveValidator } from '../../common/helpers';
import l from '../../common/logger';
import { shortenLink } from '../../common/rebrandly';
import { byParam, deleteObject, insert } from './db.service';

class InterviewsService {
  all(createdBy) {
    l.info(`${this.constructor.name}.all(${createdBy})`);
    const search = { createdBy };
    return byParam(search, 'interviews');
  }

  archives(createdBy) {
    l.info(`${this.constructor.name}.archives(${createdBy})`);
    const search = { createdBy };
    return byParam(search, 'interviews', false, true);
  }

  async insert(data, createdBy) {
    l.info(`${this.constructor.name}.insert(${data},${createdBy})`);
    const objId = ObjectId();
    const longUrl = `https://interviews.deephire.com/?id=${objId.valueOf()}`;
    const shortUrl = await shortenLink(longUrl, `${createdBy}'s interview ${data.interviewName}`);
    const shortList = { ...data, createdBy, _id: objId, shortUrl };
    return insert(shortList, 'interviews');
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
