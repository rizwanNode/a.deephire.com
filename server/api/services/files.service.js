import l from '../../common/logger';
import { uploadS3 } from '../../common/aws';

const bucket = 'deephire.data';

class CandidatesService {
  postFiles(key, files) {
    const { upfile } = files;
    const { path, originalname } = upfile;
    l.info(`${this.constructor.name}.put(${key})`);
    const fullKey = `camerakitHack/${key}/${originalname}`;
    return uploadS3(bucket, fullKey, path);
  }
}

export default new CandidatesService();
