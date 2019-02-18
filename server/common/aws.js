import AWS from 'aws-sdk';

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


const uploadS3 = async (fileUri, bucket, key) => {
  const data = await new Promise(((resolve, reject) => {
    fs.readFile(fileUri, (err, data) => (err ? reject(err) : resolve(data)));
  })).catch(err => (err));
  return new Promise((resolve, reject) => {
    s3.putObject({ Body: data, Bucket: bucket, Key: key }, (err, data) =>
      (err ? reject(err) : resolve(data)));
  }).catch(err => (err));
};

export default uploadS3;
