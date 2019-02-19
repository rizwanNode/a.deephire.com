import l from '../../common/logger';
import uploadS3 from '../../common/aws';

import { byParam, put } from './db.service';

class CandidatesService {
  byParam(userId) {
    l.info(`${this.constructor.name}.byParam(${userId})`);
    const search = { userId };
    return byParam(search, 'candidates').then(r => r[0]);
  }

  put(userId, data) {
    l.info(`${this.constructor.name}.put(${userId},${data})`);
    const search = { userId };
    /* eslint-disable no-param-reassign */
    data.userId = userId;
    return put(search, 'candidates', data);
  }


  async postDocuments(userId, name, files) {
    const { upfile } = files;
    const { path, originalName } = upfile;
    l.info(`${this.constructor.name}.put(${userId},${path})`);
    const bucketName = 'deephire.data';
    const key = `candidates/documents/${originalName}`;
    return uploadS3(bucketName, key, path);
  }
}

export default new CandidatesService();
