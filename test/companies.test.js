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

describe('Tests with an unpopulated Database', () => {
  beforeEach(async () => {
    const connection = await MongoClient.connect(global.__MONGO_URI__, {
      useNewUrlParser: true
    });
    const db = await connection.db(`${global.__MONGO_DB_NAME__}`);
    companies = db.collection('companies');
    await companies.deleteMany({});
  });

  describe('GET companies', () => {
    test('Send invalid ID', async () => {
      const id = 'abcd';
      const response = await request(Server).get(`/v1/companies/${id}`);
      expect(response.statusCode).toBe(400);
    });
    test('Send non-existant ID', async () => {
      const id = id1;
      const response = await request(Server).get(`/v1/companies/${id}`);
      expect(response.statusCode).toBe(404);
    });
  });

  // TODO - Fix this so it doesn't create companies in Stripe
  // describe('POST companies', () => {
  //   test('Add a valid company', async () => {
  //     const companyData = {
  //       owner: 'russell@deephire.com',
  //       companyName: 'TestCompany',
  //       _id: id1
  //     };
  //     const response = await request(Server)
  //       .post('/v1/companies')
  //       .send(companyData);
  //     expect(response.statusCode).toBe(201);
  //     expect(response.headers.location).toBe(`/v1/companies/${id1}`);

  //     const results = await companies.findOne(new ObjectId(id1));
  //     delete results.timestamp;
  //     const { owner, companyName } = results;
  //     expect(owner).toBe(companyData.owner);
  //     expect(companyName).toBe(companyData.companyName);
  //   });
  //   test('Send invalid company Data', async () => {
  //     const companyData = { junk: 'wow' };
  //     const response = await request(Server)
  //       .post('/v1/companies')
  //       .send(companyData);
  //     expect(response.statusCode).toBe(400);
  //   });
  // });
});

describe('Tests with an populated Database', () => {
  beforeEach(async () => {
    const connection = await MongoClient.connect(global.__MONGO_URI__, {
      useNewUrlParser: true
    });
    const db = await connection.db(`${global.__MONGO_DB_NAME__}`);
    companies = db.collection('companies');
    await companies.deleteMany({});

    const getById = { _id: new ObjectId(id1) };
    const mockCompanies = [getById];
    await companies.insertMany(mockCompanies);
  });

  describe('GET companies', () => {
    test('Get company info', async () => {
      const id = id1;
      const response = await request(Server).get(`/v1/companies/${id}`);
      expect(response.statusCode).toBe(200);
    });
  });
});
