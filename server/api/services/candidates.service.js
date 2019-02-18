import AWS from 'aws-sdk';


import l from '../../common/logger';
import { byParam, put } from './db.service';

const fs = require('fs');

AWS.config.update({
  region: 'us-east-2',
  credentials: new AWS.CognitoIdentityCredentials({
    region: 'us-east-2',
    IdentityPoolId: 'us-east-2:c1ef2b74-b16e-439d-b701-2fbe8be525a6',
  }),
});

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: { Bucket: 'candidate.documents' },
});

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

    const data = await new Promise(((resolve, reject) => {
      fs.readFile(fileUri, (err, data) => (err ? reject(err) : resolve(data)));
    }));
    s3.putObject({ Body: data, Bucket: 'candidate.documents', Key: objectKey }, (err, data) => {
      if (err) {
        return Promise.resolve(err);
      }
      l.info(`${this.constructor.name}.data(${data}`);

      return Promise.resolve(data);
    });
    return Promise.resolve(data);
  }
}

export default new CandidatesService();
