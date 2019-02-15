import AWS from 'aws-sdk';

import l from '../../common/logger';
import { byParam, put } from './db.service';

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

  postDocuments(userId, objectKey, body) {
    l.info(`${this.constructor.name}.put(${userId},${body})`);

    console.log('Put documents body', body);

    s3.putObject({ Body: body, Bucket: 'candidate.documents', Key: objectKey }, (err, data) => {
      if (err) {
        console.log('ERRORO ERRO REERRO', err);
        return Promise.resolve(400);
      }
      console.log('DATA DATA DATA', data);
      return Promise.resolve(200);
    });
    return Promise.resolve(200);
  }
}

export default new CandidatesService();
