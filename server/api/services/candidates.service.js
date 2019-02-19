import l from '../../common/logger';
import { uploadS3, downloadS3 } from '../../common/aws';

import { byParam, put } from './db.service';

const collection = 'candidates';
const bucket = 'deephire.data';

class CandidatesService {
  byParam(userId) {
    l.info(`${this.constructor.name}.byParam(${userId})`);
    const search = { userId };
    return byParam(search, collection).then(r => r[0]);
  }

  put(userId, data) {
    l.info(`${this.constructor.name}.put(${userId},${data})`);
    const search = { userId };
    /* eslint-disable no-param-reassign */
    data.userId = userId;
    return put(search, collection, data);
  }


  async getDocuments(userId, num) {
    const search = { userId };
    const key = await byParam(search, collection).then(r => r[0].files[num]).catch(err => err);
    return downloadS3(bucket, key);
  }

  postDocuments(userId, name, files) {
    const { upfile } = files;
    const { path, originalName } = upfile;
    l.info(`${this.constructor.name}.put(${userId},${path})`);
    const key = `candidates/documents/${originalName}`;
    return uploadS3(bucket, key, path);
  }
}

export default new CandidatesService();
