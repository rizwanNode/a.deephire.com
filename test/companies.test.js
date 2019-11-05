// import token from './common';
import request from 'supertest';
import Server from '../server/index';
import { dbConnected, id1 } from './common';

const { ObjectId, MongoClient } = require('mongodb');

let companies;

beforeAll(async () => {
  process.env.TESTING = true;
  await dbConnected();
});

beforeEach(async () => {
  const connection = await MongoClient.connect(global.__MONGO_URI__, {
    useNewUrlParser: true
  });
  const db = await connection.db(global.__MONGO_DB_NAME__);
  companies = db.collection('companies');
  await companies.deleteMany({});
});

describe('Tests with an unpopulated Database', () => {
  describe('POST companies', () => {
    test('Add a valid company', async () => {
      const companyData = {
        owner: 'russell@deephire.com',
        companyName: 'TestCompany',
        _id: id1
      };
      const response = await request(Server)
        .post('/v1/companies')
        .send(companyData);
      expect(response.statusCode).toBe(201);
      expect(response.headers.location).toBe(`/v1/companies/${id1}`);

      const results = await companies.findOne({ _id: id1 });
      delete results.timestamp;
      expect(results).toEqual({ _id: new ObjectId(id1), ...companyData });
    });
    test('Send invalid company Data', async () => {
      const companyData = { junk: 'wow' };
      const response = await request(Server)
        .post('/v1/companies')
        .send(companyData);
      expect(response.statusCode).toBe(400);
    });
  });
});
