import { ObjectId } from 'mongodb';
import l from '../../common/logger';
import { deleteObject, byParam, insert, update } from './db.service';
import { shortenLink } from '../../common/rebrandly';

const arch = (data, archived, col) => {
  let objectIds = [];
  try {
    objectIds = data.map(id => {
      if (ObjectId.isValid(id)) {
        return new ObjectId(id);
      }
      throw new Error('Invalid ObjectId');
    });
  } catch (err) {
    return Promise.resolve(400);
  }

  const search = { _id: { $in: objectIds } };
  const updateData = { $set: { archived } };

  return update(search, updateData, col);
};
class InterviewsService {
  all(createdBy) {
    l.info(`${this.constructor.name}.all(${createdBy})`);
    const search = { createdBy };
    return byParam(search, 'interviews');
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
    return arch(data, new Date().toString(), 'interviews_test');
  }

  unarchive(data) {
    l.info(`${this.constructor.name}.unarchive(${data})`);
    return arch(data, false, 'interviews_test');
  }
}

export default new InterviewsService();
