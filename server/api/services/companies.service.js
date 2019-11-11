import l from '../../common/logger';
import { insert, byId, put } from './db.service';
import { uploadS3 } from '../../common/aws';

const collection = 'companies';
const bucket = 'deephire.data.public';
class CompaniesService {
  insert(data) {
    l.info(`${this.constructor.name}.insert(${JSON.stringify(data)})`);
    return insert(data, collection).then(r => r._id);
  }

  byId(companyId) {
    l.info(`${this.constructor.name}.byParam(${companyId})`);
    return byId(companyId, collection, true);
  }

  async putLogo(companyId, files) {
    l.info(`${this.constructor.name}.put(${JSON.stringify(files)})`);
    const { upfile } = files;
    const { path, originalname: originalName } = upfile;
    const key = `companies/${companyId}/${originalName}`;

    uploadS3(bucket, key, path, 'public-read');
    const data = {
      logo: `https://s3.amazonaws.com/${bucket}/${key}`
    };
    return put(companyId, collection, data, true);
  }
}

export default new CompaniesService();
