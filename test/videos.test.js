// import token from './common';
import request from 'supertest';
import Server from '../server/index';
import { dbConnected, id1, id2, id3, id4, id5, id6, token } from './common';

const email = 'testing@deephire.com';
const filterEmail = 'testingFilter@deephire.com';
const { ObjectId, MongoClient } = require('mongodb');

let videos;

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
      .get('/v1/videos/filter')
      .set('Authorization', token);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });

  describe('POST videos/:id/archive', () => {
    test('archive individual video', async () => {
      const response = await request(Server)
        .post(`/v1/videos/${id1}/archive`)
        .send([0])
        .set('Authorization', token);
      expect(response.statusCode).toBe(404);
    });
  });
  test('POST videos/:id/archive invalid objectID', async () => {
    const response = await request(Server)
      .post(`/v1/videos/${1}/archive`)
      .send([0])
      .set('Authorization', token);
    expect(response.statusCode).toBe(400);
  });

  describe('POST videos/:id/unarchive', () => {
    test('unarchive individual video', async () => {
      const response = await request(Server)
        .post(`/v1/videos/${id1}/unarchive`)
        .send([0])
        .set('Authorization', token);
      expect(response.statusCode).toBe(404);
    });
    test('POST videos/:id/unarchive invalid objectID', async () => {
      const response = await request(Server)
        .post(`/v1/videos/${1}/unarchive`)
        .send([0])
        .set('Authorization', token);
      expect(response.statusCode).toBe(400);
    });
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

  const testArchiveVideoNoResponsesOrArchived = {
    _id: new ObjectId(id3),
  };
  const testArchiveVideo = {
    _id: new ObjectId(id4),
    responses: ['testing'],
  };

  const testArchiveVideoResponseAndArchived = {
    _id: new ObjectId(id5),
    responses: ['testing'],

    archivedResponses: ['resp1'],
  };

  const testArchiveVideoNoResponses = {
    _id: new ObjectId(id6),
    archivedResponses: ['test'],
  };

  // const testUnarchiveVideo = {
  //   _id: new ObjectId(id7),
  // };

  const mockVideos = [
    testPostVideos,
    testFilterVideos,
    testArchiveVideo,
    testArchiveVideoNoResponsesOrArchived,
    testArchiveVideoResponseAndArchived,
    testArchiveVideoNoResponses,
  ];

  // const addInterview = { _id: new ObjectId(id2), createdBy: email };
  // const mockInterviews = [addInterview];

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

  describe('POST videos/:id/archive', () => {
    test('archive individual video 3', async () => {
      const response = await request(Server)
        .post(`/v1/videos/${id3}/archive`)
        .send([0])
        .set('Authorization', token);
      expect(response.statusCode).toBe(200);
    });

    test('archive individual video id4', async () => {
      const response = await request(Server)
        .post(`/v1/videos/${id4}/archive`)
        .send([0])
        .set('Authorization', token);
      expect(response.statusCode).toBe(200);

      await new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, 0);
      });
      const results = await videos.findOne(ObjectId(id4));
      expect(results).toEqual({
        _id: new ObjectId(id4),
        responses: [],
        archivedResponses: ['testing'],
      });
    });

    test('archive individual video', async () => {
      const response = await request(Server)
        .post(`/v1/videos/${id5}/archive`)
        .send([0])
        .set('Authorization', token);
      expect(response.statusCode).toBe(200);

      await new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, 0);
      });

      const results = await videos.findOne(ObjectId(id5));
      expect(results).toEqual({
        _id: new ObjectId(id5),
        responses: [],
        archivedResponses: ['resp1', 'testing'],
      });
    });
  });

  describe('POST videos/:id/unarchive', () => {
    test('unarchive individual video id5', async () => {
      const response = await request(Server)
        .post(`/v1/videos/${id5}/unarchive`)
        .send([0])
        .set('Authorization', token);
      expect(response.statusCode).toBe(200);

      await new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, 0);
      });

      const results = await videos.findOne(ObjectId(id5));
      expect(results).toEqual({
        _id: new ObjectId(id5),
        responses: ['testing', 'resp1'],
        archivedResponses: [],
      });
    });

    test('unarchive individual video id4', async () => {
      const response = await request(Server)
        .post(`/v1/videos/${id4}/unarchive`)
        .send([0])
        .set('Authorization', token);
      expect(response.statusCode).toBe(200);

      await new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, 0);
      });

      const results = await videos.findOne(ObjectId(id4));
      expect(results).toEqual({
        _id: new ObjectId(id4),
        responses: ['testing'],
      });
    });

    test('unarchive individual video id6', async () => {
      const response = await request(Server)
        .post(`/v1/videos/${id6}/unarchive`)
        .send([0])
        .set('Authorization', token);
      expect(response.statusCode).toBe(200);

      await new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, 0);
      });

      const results = await videos.findOne(ObjectId(id6));
      expect(results).toEqual({
        _id: new ObjectId(id6),
        responses: ['test'],
        archivedResponses: [],
      });
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
