import l from '../../common/logger';
import { insert, byId, put } from './db.service';
import { uploadS3 } from '../../common/aws';
import { auth0Managment } from '../../common/auth';

const collection = 'companies';
const bucket = 'deephire.data.public';
class CompaniesService {
  insert(data) {
    l.info(`${this.constructor.name}.insert(${JSON.stringify(data)})`);
    return insert(data, collection).then(r => r._id);
  }

  byId(companyId) {
    l.info(`${this.constructor.name}.byId(${companyId})`);
    return byId(companyId, collection, true);
  }

  byIdPublic(companyId) {
    l.info(`${this.constructor.name}.byIdPublic(${companyId})`);
    return byId(companyId, collection, true).then(r => {
      if (r.clockworkIntegration) {
        // eslint-disable-next-line no-param-reassign
        delete r.clockworkIntegration.key;
        return r;
      }
      return r;
    });
  }

  async putLogo(companyId, files) {
    l.info(`${this.constructor.name}.putLogo(${JSON.stringify(files)})`);
    const { upfile } = files;
    const { path, originalname: originalName } = upfile;
    const key = `companies/${companyId}/${originalName}`;

    uploadS3(bucket, key, path, 'public-read');
    const data = {
      logo: `https://s3.amazonaws.com/${bucket}/${key}`
    };
    return put(companyId, collection, data, true);
  }

  async put(companyId, data) {
    l.info(`${this.constructor.name}.put(${companyId}`);
    return put(companyId, collection, data, true);
  }

  //   async getInvites(companyId) {
  //   l.info(`${this.constructor.name}.getInvites(${companyId}`);
  //   return put(companyId, collection, true);
  // }

  async getTeam(companyId) {
    l.info(`${this.constructor.name}.getTeam(${companyId}`);
    const team = await auth0Managment
      .getUsers({
        q: `app_metadata.companyId:${companyId}`
      });
    return team;
  }
}

export default new CompaniesService();
