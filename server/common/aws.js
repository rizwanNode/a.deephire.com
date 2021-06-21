import AWS from 'aws-sdk';
import l from './logger';

const fs = require('fs');

AWS.config.update({
  region: 'us-east-2',
  credentials: new AWS.CognitoIdentityCredentials({
    region: 'us-east-2',
    IdentityPoolId: process.env.IDENTITY_POOL_ID,
  }),
});

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
});

export const uploadS3 = async (bucket, key, fileUri, access = 'private') => {
  const data = await new Promise((resolve, reject) => {
    fs.readFile(fileUri, (err, data) => (err ? reject(err) : resolve(data)));
  }).catch(err => l.error('uploads3 Error', err));
  return new Promise((resolve, reject) => {
    s3.putObject(
      { ACL: access, Body: data, Bucket: bucket, Key: key },
      (err, data) => (err ? reject(err) : resolve(data))
    );
  }).catch(err => l.error('putObject error', err));
};

export const uploadS3Stream = async (bucket, key, stream, access = 'private') =>
  new Promise((resolve, reject) => {
    const params = { ACL: access, Body: stream, Bucket: bucket, Key: key };
    s3.upload(params, {}, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  }).catch(err => l.error('upload error stream', err));

export const downloadS3 = (bucket, key) => {
  const params = {
    Bucket: bucket,
    Key: key,
  };
  return s3.getObject(params).createReadStream();
};

export const deleteS3 = (bucket, key) => {
  AWS.config.update({
    region: 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const s3 = new AWS.S3({
    apiVersion: '2006-03-01',
  });
  const params = {
    Bucket: bucket,
    Key: key,
  };
  return s3
    .deleteObject(params, (err, data) => {
      // eslint-disable-next-line no-console
      l.info(`deleted ${bucket}/${key}`, err, data);
    })
    .createReadStream();
};
