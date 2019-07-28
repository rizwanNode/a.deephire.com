// import token from './common';
import request from 'supertest';
import Server from '../server/index';
import { dbConnected, id1, id2, token } from './common';

const email = 'testing@deephire.com';
const filterEmail = 'testingFilter@deephire.com';
const { ObjectId, MongoClient } = require('mongodb');

let videos;
let interviews;
beforeAll(async () => {
  process.env.TESTING = true;
  await dbConnected();
});

describe('Tests with an unpopulated Database', () => {
  describe('GET videos/filter', () => {
    test('GET videos/filter?candidateEmail', async () => {
      const response = await request(Server)
        .get(`/v1/videos/filter?candidateEmail=${filterEmail}`)
        .set('Authorization', token);
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual([]);
    });
  });
  test('GET videos/filter', async () => {
    const response = await request(Server)
      .get(`/v1/videos/filter`)
      .set('Authorization', token);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });
});

describe('Tests with a populated Database', () => {
  const testFilterVideos = {
    _id: new ObjectId(id2),
    interviewId: new ObjectId(id2),
    candidateEmail: filterEmail,
  };
  const testPostVideos = {
    _id: new ObjectId(id1),
    interviewId: new ObjectId(id2),
    candidateEmail: email,
  };
  const mockVideos = [testPostVideos, testFilterVideos];

  const addInterview = { _id: new ObjectId(id2), createdBy: email };
  const mockInterviews = [addInterview];

  beforeEach(async () => {
    const connection = await MongoClient.connect(global.__MONGO_URI__, { useNewUrlParser: true });
    const db = await connection.db(global.__MONGO_DB_NAME__);
    videos = db.collection('videos');
    await videos.deleteMany({});
    await videos.insertMany(mockVideos);

    // interviews = db.collection('interviews');
    // await interviews.deleteMany({});
    // await interviews.insertMany(mockInterviews);
  });
  afterEach(async () => {
    await videos.deleteMany({});
    // await interviews.deleteMany({});
  });

  describe('POST videos', () => {
    test('Add a new video response', async () => {
      const question1 = 'whats your name?';
      const question2 = 'whats your name2?';
      const responses1 = [
        {
          question: question1,
          response: 'https://www.youtube.com/watch?v=5pX3mwnAvyo',
        },
      ];

      const responses2 = [
        {
          question: question1,
          response: 'https://www.youtube.com/watch?v=5pX3mwnAvyo',
        },
        {
          question: question2,
          response: 'https://www.youtube.com/watch?v=5pX3mwnAvyo',
        },
      ];
      await insertVideo(question1, responses1);
      await insertVideo(question1, responses1);
      await insertVideo(question2, responses2);
    });
  });

  // describe('GET videos/filter', () => {
  //   test('GET videos/filter?candidateEmail', async () => {
  //     const cat = await interviews.find({}).toArray();
  //     const dog = await videos.find({}).toArray();
  //     const response = await request(Server)
  //       .get(`/v1/videos/filter?candidateEmail=${filterEmail}`)
  //       .set('Authorization', token);
  //     expect(response.statusCode).toBe(200);
  //     expect(response.body).toEqual([testFilterVideos]);
  //   });

  //   test('GET videos/filter', async () => {
  //     const response = await request(Server)
  //       .get(`/v1/videos/filter`)
  //       .set('Authorization', token);
  //     expect(response.statusCode).toBe(200);
  //     expect(response.body).toEqual(mockVideos);
  //   });
  // });
});

const insertVideo = async (question, responses) => {
  const userInfo = {
    candidateEmail: email,
    interviewId: id2,
    responses: {
      question,
      response: 'https://www.youtube.com/watch?v=5pX3mwnAvyo',
    },
  };
  const response = await request(Server)
    .post('/v1/videos')
    .send(userInfo);
  expect(response.statusCode).toBe(201);
  expect(response.headers.location).toBe(`/v1/videos/${id1}`);

  const results = await videos.findOne(ObjectId(id1));
  delete results._id;
  delete results.interviewId;
  expect(results).toEqual({
    candidateEmail: 'testing@deephire.com',
    responses,
  });
};
