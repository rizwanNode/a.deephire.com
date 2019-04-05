import l from '../../common/logger';
import { uploadS3, downloadS3 } from '../../common/aws';

import { byParam, put } from './db.service';

const collection = 'candidates';
const bucket = 'deephire.data';

class CandidatesService {
  byParam(email) {
    l.info(`${this.constructor.name}.byParam(${email})`);
    const search = { email };
    return byParam(search, collection).then(r => r[0]);
  }

  put(email, data) {
    l.info(`${this.constructor.name}.put(${email},${data})`);
    const search = { email };
    /* eslint-disable no-param-reassign */
    data.email = email;
    return put(search, collection, data);
  }

  async getDocuments(email, num) {
    const search = { email };
    const key = await byParam(search, collection)
      .then(r => r[0].files[num])
      .catch(err => err);
    return downloadS3(bucket, key);
  }

  postDocuments(email, files) {
    l.info(`${this.constructor.name}.put(${email},${JSON.stringify(files)})`);
    const { upfile } = files;
    const { path, originalname: originalName } = upfile;
    const key = `candidates/${email}/${originalName}`;
    // put(email, key) - add to mongodb
    return uploadS3(bucket, key, path);
  }
}

export default new CandidatesService();
