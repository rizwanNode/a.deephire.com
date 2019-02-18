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


  async postDocuments(userId, objectKey, fileUri) {
    l.info(`${this.constructor.name}.put(${userId},${fileUri})`);
    return uploadS3('candidate.documents', fileUri);
  }
}

export default new CandidatesService();
