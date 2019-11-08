import { ObjectId } from 'mongodb';
import { archiveValidator, duplicateValidator } from '../../common/helpers';
import l from '../../common/logger';
import { shortenLink } from '../../common/rebrandly';
import { byParam, deleteObject, insert, put } from './db.service';

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

  async insert(data, createdBy, companyId) {
    l.info(`$this.constructor.name}.insert(${data},${createdBy}, ${companyId})`);
    const objId = ObjectId();
    const longUrl = `https://interviews.deephire.com/?id=${objId.valueOf()}`;
    const shortUrl = await shortenLink(
      longUrl,
      'interview.deephire.com',
      `${createdBy}'s interview ${data.interviewName}`,
    );
    const shortList = { ...data, createdBy, _id: objId, shortUrl, companyId: new ObjectId(companyId) };
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

  put(id, data) {
    l.info(`${this.constructor.name}.update(${id}, ${JSON.stringify(data)})`);
    delete data._id;
    return put(id, 'interviews', data, true, false);
  }

  duplicate(data) {
    l.info(`${this.constructor.name}.duplicate(${data})`);
    return duplicateValidator(data, 'interviews');
  }
}

export default new InterviewsService();
