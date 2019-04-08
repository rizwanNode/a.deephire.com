import { ObjectId } from 'mongodb';
import l from '../../common/logger';
import { uploadS3, downloadS3 } from '../../common/aws';
import { byParam, put, deleteSubDocument } from './db.service';

const collection = 'candidates';
const bucket = 'deephire.data';

class CandidatesService {
  byParam(email) {
    l.info(`${this.constructor.name}.byParam(${email})`);
    const search = { email };
    return byParam(search, collection).then(r => r[0]);
  }

  put(email, data) {
    l.info(`${this.constructor.name}.put(${email},${JSON.stringify(data)})`);
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

  async deleteDocuments(email, uid) {
    const search = { email };
    return deleteSubDocument(search, uid, collection);
  }

  async postDocuments(email, files) {
    l.info(`${this.constructor.name}.put(${email},${JSON.stringify(files)})`);
    const { upfile } = files;
    const { path, originalname: originalName } = upfile;
    const key = `candidates/${email}/${originalName}`;
    const search = { email };
    const data = (await byParam(search, collection).then(r => r[0])) || {};

    const fileData = {
      key,
      name: originalName,
      uid: ObjectId().valueOf(),
    };
    if (data.files) {
      data.files.push(fileData);
    } else {
      data.files = [fileData];
    }
    uploadS3(bucket, key, path);
    return put(search, collection, data);
  }
}

export default new CandidatesService();
