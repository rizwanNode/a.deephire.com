// import token from './common';
import request from 'supertest';
import Server from '../server/index';

const { ObjectId, MongoClient } = require('mongodb');

// describe('insert', () => {
//   let connection;
//   let db;

//   beforeAll(async () => {
//     connection = await MongoClient.connect(global.__MONGO_URI__, { useNewUrlParser: true });
//     db = await connection.db(global.__MONGO_DB_NAME__);
//   });

//   afterAll(async () => {
//     await connection.close();
//   });

//   it('should insert a doc into collection', async () => {
//     const users = db.collection('users');

//     const mockUser = { _id: 'some-user-id', name: 'John' };
//     await users.insertOne(mockUser);

//     const insertedUser = await users.findOne({ _id: 'some-user-id' });
//     expect(insertedUser).toEqual(mockUser);
//   });
// });

const token =
  'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik9ESkVORGMxUVVGRU5FSXhNMEpDTVVJMU1EUkVRVEJGUkVRMU9UWkdOVUV4TVRWRlFrSkRRUSJ9.eyJpc3MiOiJodHRwczovL2xvZ2luLmRlZXBoaXJlLmNvbS8iLCJzdWIiOiJhdXRoMHw1Y2NmMjBiZjI2MmI2YTBlMDQ3YzgxNzEiLCJhdWQiOlsiaHR0cDovL2EuZGVlcGhpcmUuY29tIiwiaHR0cHM6Ly9kZWVwaGlyZTIuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTU1NzY2Njg3NSwiZXhwIjoxNTU3Njc0MDc1LCJhenAiOiJqaHpHRlpIVHY4ZWhwR3NrVkt4WnJfalhPQXZLZzdEVSIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwifQ.Z_fvzpVp9Y4p_jymvWUSP-_PWcP7L8A49NM4SD-D_lMqVEO_dAHOuaLFWNSoWZ4j4EitKID05yyAxA4iP00slg73CZxDCbx40nwlVUaJyuFlI7Knrw_Jsg0Ajx7sYWwO8SbEb8YvHKNhepr3_qml2zgU3cRr3LmixbbQPVoCLzFv53Laolf8VHyfOENkwNfWVYEamTVHMk0G5fJko0t-3w_EbU4bKlNfSrTWs4Zpk7a0rq7wqBXEs2GVu-Ey3N9oSrIvXC5jxPy1LAbnWLjHAyQN3ZkReB6nFgTLa7N8DpUpcaVduZYDBl0b9ovCFuICjpk6Z9dll1oBYjVhKX1vAg';
const id1 = '5cd403861c9d440000eb7541';
const id2 = '5cd403861c9d440000eb7542';
const createdBy = 'testing@gmail.com';
let interviews;

const dbConnected = async () => {
  await new Promise(resolve => setTimeout(() => resolve(), 500));
  if (process.env.CONNECTED) return true;
  return dbConnected();
};

beforeAll(async () => {
  process.env.TESTING = true;
  await dbConnected();
});

describe('Tests with a populated Database', () => {
  beforeEach(async () => {
    const connection = await MongoClient.connect(global.__MONGO_URI__, { useNewUrlParser: true });
    const db = await connection.db(global.__MONGO_DB_NAME__);
    interviews = db.collection('interviews');
    const getById = { _id: new ObjectId(id1), createdBy };
    const testUnArchive = {
      _id: new ObjectId(id2),
      archives: 'Fri May 10 2019 17:45:14 GMT-0400 (Eastern Daylight Time)',
    };
    const mockInterviews = [getById, testUnArchive];
    await interviews.insertMany(mockInterviews);
  });
  afterEach(async () => {
    interviews.deleteMany({});
  });

  describe('GET interviews/:id', () => {
    test('Should get an interview by ID', async () => {
      const id = id1;
      const response = await request(Server).get(`/v1/interviews/${id}`);
      expect(response.statusCode).toBe(200);
    });
  });
  describe('GET interviews', () => {
    test('Get list of all unarchived interviews for a recruiter', async () => {
      const response = await request(Server)
        .get('/v1/interviews')
        .set('Authorization', token);
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([{ _id: id1, createdBy }]);
      expect(response.type).toMatch(/json/);
    });
  });

  describe('POST interviews/unarchive', () => {
    test('unarchive an array of interviews', async () => {
      const ids = [id2];
      const response = await request(Server)
        .post('/v1/interviews/unarchive')
        .send(ids)
        .set('Authorization', token);
      expect(response.statusCode).toBe(200);
    });
  });

  describe('POST interviews/archive', () => {
    test('archive an array of interviews', async () => {
      const ids = [id1];
      const response = await request(Server)
        .post('/v1/interviews/archive')
        .send(ids)
        .set('Authorization', token);
      expect(response.statusCode).toBe(200);
    });
  });
});

describe('Tests with an unpopulated Database', () => {
  describe('GET interviews/:id', () => {
    test('Send Invalid ID', async () => {
      const id = 'abcd';
      const response = await request(Server).get(`/v1/interviews/${id}`);
      expect(response.statusCode).toBe(400);
    });
    test('Send non-existant ID', async () => {
      const id = id1;
      const response = await request(Server).get(`/v1/interviews/${id}`);
      expect(response.statusCode).toBe(404);
    });

    test('Invalid request type', async () => {
      const id = id1;
      const response = await request(Server).post(`/v1/interviews/${id}`);
      expect(response.statusCode).toBe(405);
    });
  });

  describe('GET interviews', () => {
    test('Get list of all unarchived interviews for a recruiter', async () => {
      const response = await request(Server)
        .get('/v1/interviews')
        .set('Authorization', token);
      expect(response.statusCode).toBe(404);
    });
  });
  test('Send Invalid Auth Key', async () => {
    const response = await request(Server)
      .get('/v1/interviews')
      .set('Authorization', 123);
    expect(response.statusCode).toBe(401);
  });
});

// commented out because it would make a shortlist everytime - NOT WANTED
// describe('POST interviews/', () => {
//   test('Create a new interview', async () => {
//     const response = await request(Server).post('/v1/interviews/')
//     .send({})
//     .set('Authorization', token);
//     expect(response.statusCode).toBe(401);
//   });
// });
describe('POST interviews/unarchive', () => {
  test('unarchive an array of interviews', async () => {
    const ids = [id1];
    const response = await request(Server)
      .post('/v1/interviews/unarchive')
      .send(ids)
      .set('Authorization', token);
    expect(response.statusCode).toBe(404);
  });

  //   test('send array without object ids', async () => {
  //     const ids = ['502', '5c7499803'];
  //     const response = await request(Server)
  //       .post('/v1/interviews/unarchive')
  //       .send(ids)
  //       .set('Authorization', token);
  //     expect(response.statusCode).toBe(400);
  //   });

  //   test('send ids that dont exist', async () => {
  //     const ids = ['111111111111111111111111', '111111111111111111111111'];
  //     const response = await request(Server)
  //       .post('/v1/interviews/unarchive')
  //       .send(ids)
  //       .set('Authorization', token);
  //     expect(response.statusCode).toBe(404);
  //   });

  //   test('send json data', async () => {
  //     const ids = {
  //       ids: ['111111111111111111111111', '111111111111111111111111'],
  //     };
  //     const response = await request(Server)
  //       .post('/v1/interviews/unarchive')
  //       .send(ids)
  //       .set('Authorization', token);
  //     expect(response.statusCode).toBe(400);
  //   });
  // });
  // describe('POST interviews/archive', () => {
  //   test('archive an array of interviews', async () => {
  //     const ids = ['5cd404d41c9d440000eb7542'];
  //     const response = await request(Server)
  //       .post('/v1/interviews/archive')
  //       .send(ids)
  //       .set('Authorization', token);
  //     expect(response.statusCode).toBe(200);
  //   });

  //   test('send array without object ids', async () => {
  //     const ids = ['502', '5c7499803'];
  //     const response = await request(Server)
  //       .post('/v1/interviews/archive')
  //       .send(ids)
  //       .set('Authorization', token);
  //     expect(response.statusCode).toBe(400);
  //   });

  //   test('send ids that dont exist', async () => {
  //     const ids = ['111111111111111111111111', '111111111111111111111111'];
  //     const response = await request(Server)
  //       .post('/v1/interviews/archive')
  //       .send(ids)
  //       .set('Authorization', token);
  //     expect(response.statusCode).toBe(404);
  //   });

  //   test('send json data', async () => {
  //     const ids = {
  //       ids: ['111111111111111111111111', '111111111111111111111111'],
  //     };
  //     const response = await request(Server)
  //       .post('/v1/interviews/archive')
  //       .send(ids)
  //       .set('Authorization', token);
  //     expect(response.statusCode).toBe(400);
  //   });
  // });

  // describe('GET interviews/archives', () => {
  //   test('Get list of all archived Interviews for a recruiter', async () => {
  //     const response = await request(Server)
  //       .get('/v1/interviews/archives')
  //       .set('Authorization', token)
  //       .expect('Content-Type', /json/);
  //     expect(response.statusCode).toBe(200);
  //   });

  //   test('Send Invalid Auth Key', async () => {
  //     const response = await request(Server)
  //       .get('/v1/interviews/archives')
  //       .set('Authorization', 123);
  //     expect(response.statusCode).toBe(401);
  //   });
  // });
});
