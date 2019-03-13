import { ObjectId } from 'mongodb';
import l from '../../common/logger';
import { deleteObject, byParam, insert } from './db.service';
import { shortenLink } from '../../common/rebrandly';


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
    const shortList = { ...data, createdBy, _id: objId, shortUrl, pin }; return insert(shortList, 'interviews_test');
  }

  byParam(id) {
    l.info(`${this.constructor.name}.byParam(${id})`);
    return byParam(id, 'interviews', true);
  }


  delete(id) {
    l.info(`${this.constructor.name}.delete(${id})`);
    return deleteObject(id, 'interviews');
  }
}

export default new InterviewsService();
