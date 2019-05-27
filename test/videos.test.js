// import token from './common';
import request from 'supertest';
import Server from '../server/index';
import { dbConnected, id1, id2 } from './common';

const email = 'testing@deephire.com';
const { ObjectId, MongoClient } = require('mongodb');

let videos;
beforeAll(async () => {
  process.env.TESTING = true;
  await dbConnected();
});

describe('Tests with a populated Database', () => {
  beforeEach(async () => {
    const connection = await MongoClient.connect(global.__MONGO_URI__, { useNewUrlParser: true });
    const db = await connection.db(global.__MONGO_DB_NAME__);
    videos = db.collection('videos');
    await videos.deleteMany({});

    const testPostVideos = {
      _id: new ObjectId(id1),
      interviewId: new ObjectId(id2),
      candidateEmail: email,
    };
    const mockvideos = [testPostVideos];
    await videos.insertMany(mockvideos);
  });
  afterEach(async () => {
    await videos.deleteMany({});
  });

  describe('POST videos', () => {
    test('Add a new video response', async () => {
      const userInfo = {
        candidateEmail: email,
        interviewId: id2,
        responses: {
          question: 'whats your name?',
          response: 'https://www.youtube.com/watch?v=5pX3mwnAvyo',
        },
      };
      const response = await request(Server)
        .post('/v1/videos')
        .send(userInfo);
      expect(response.statusCode).toBe(201);
      expect(response.headers.location).toBe(`/v1/videos/${id1}`);
    });
  });
});
