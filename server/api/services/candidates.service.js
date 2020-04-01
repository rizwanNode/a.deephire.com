import { ObjectId } from 'mongodb';
import l from '../../common/logger';
import { uploadS3, downloadS3 } from '../../common/aws';
import { byParam, put, deleteSubDocument } from './db.service';

const collection = 'candidates';
const bucket = 'deephire.data';

class CandidatesService {
  async byParam(email) {
    l.info(`${this.constructor.name}.byParam(${email})`);
    const search = { email };
    const document = await byParam(search, collection).catch(err => l.error(err));
    const result = Array.isArray(document) ? document[0] : document;
    return result;
  }

  put(email, data) {
    l.info(`${this.constructor.name}.put(${email},${JSON.stringify(data)})`);
    const search = { email };
    /* eslint-disable no-param-reassign */
    data.email = email;
    return put(search, collection, data);
  }

  async getDocuments(email, id) {
    const search = { email };
    const [document] = await byParam(search, collection);
    if (!document) return null;

    const file = document.files.find(file => file.uid.toString() === id);
    if (!file) return null;

    const readableFile = downloadS3(bucket, file.key);
    if (readableFile) return { file: readableFile, fileName: file.name };
    return null;
  }

  async deleteDocuments(email, uid) {
    const search = { email };
    if (!ObjectId.isValid(uid)) {
      return Promise.resolve(400);
    }
    const objectId = new ObjectId(uid);
    const match = { files: { uid: objectId } };
    return deleteSubDocument(search, match, collection);
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
      uid: ObjectId().valueOf()
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
