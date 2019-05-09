import request from 'supertest';
import Server from '../server/index';

const token = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6Ik9ESkVORGMxUVVGRU5FSXhNMEpDTVVJMU1EUkVRVEJGUkVRMU9UWkdOVUV4TVRWRlFrSkRRUSJ9.eyJpc3MiOiJodHRwczovL2xvZ2luLmRlZXBoaXJlLmNvbS8iLCJzdWIiOiJhdXRoMHw1Y2QwNzlmNmQ3MTlmZTBmNWI5MGQxNmMiLCJhdWQiOlsiaHR0cDovL2EuZGVlcGhpcmUuY29tIiwiaHR0cHM6Ly9kZWVwaGlyZTIuYXV0aDAuY29tL3VzZXJpbmZvIl0sImlhdCI6MTU1NzM5ODYzNiwiZXhwIjoxNTU3NDA1ODM2LCJhenAiOiJqaHpHRlpIVHY4ZWhwR3NrVkt4WnJfalhPQXZLZzdEVSIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgZW1haWwifQ.TMw_lbqxSEHB6suNmIQC6oYyWqawa2iRrL4p7eZ03J2ZmTmrSUXpiZ5FbRfHoLFgRfzCdP3ShNCo7W7y25gQap7Izcys2WiNRKJbJFwt4kb5nEn0eZfvdjZ0Www_XiU3FzC9DcgqTHxGgprWMS__iV-JSP0iSWb8FIHHR7aF-I1mICKdvqPQeFNyCohcWSUVyGAiyWYxL1Xbj2GnrwjfpMAHtVyTcDgbUlG56E9OoTR4yXZr7b-RBPeaUhol0vd2R_-y5G75QiDE21A6Mu4Xjeakrry6xwT7y9uy564HYJh0-ZsdwVmpR6VVT8e-jmihBeEUGQHHh4P8TjpGiHmTaw';
beforeAll(async () => {
  process.env.TESTING = true;
  return new Promise(resolve => setTimeout(() => resolve(), 1000));
});

describe('GET interviews/:id', () => {
  test('Should get an interview by ID', async () => {
    const id = '5cd403861c9d440000eb7541';
    const response = await request(Server).get(`/v1/interviews/${id}`);
    expect(response.statusCode).toBe(200);
  });

  test('Send Invalid ID', async () => {
    const id = 'abcd';
    const response = await request(Server).get(`/v1/interviews/${id}`);
    expect(response.statusCode).toBe(400);
  });
  test('Send non-existant ID', async () => {
    const id = '129181111111111118de5c50';
    const response = await request(Server).get(`/v1/interviews/${id}`);
    expect(response.statusCode).toBe(404);
  });

  test('Invalid request type', async () => {
    const id = '129181111111111118de5c50';
    const response = await request(Server).post(`/v1/interviews/${id}`);
    expect(response.statusCode).toBe(405);
  });
});

describe('GET interviews/', () => {
  test('Get list of all unarchived interviews for a recruiter', async () => {
    const response = await request(Server)
      .get('/v1/interviews/')
      .set('Authorization', token);
    expect('Content-Type', /json/);
    expect(response.statusCode).toBe(200);
  });

  test('Send Invalid Auth Key', async () => {
    const response = await request(Server)
      .get('/v1/interviews/')
      .set('Authorization', token);
    expect(response.statusCode).toBe(403);
  });
});
// describe('POST interviews/', () => {

//   test('Create a new interview', async () => {
//   const id = 'abcd';
//   const response = await request(Server).post(`/v1/interviews/`).set('Authorization', token);
//   expect(response.statusCode).toBe(403);
// });

// });
describe('POST interviews/unarchive', () => {
  test('unarchive an array of interviews', async () => {
    const ids = ['5c79e7a9fe6cd943bd499802', '5c79e827fe6cd943bd499803'];
    const response = await request(Server)
      .post('/v1/interviews/unarchive')
      .send(ids)
      .set('Authorization', token);
    expect(response.statusCode).toBe(200);
  });

  test('send array without object ids', async () => {
    const ids = ['502', '5c7499803'];
    const response = await request(Server)
      .post('/v1/interviews/unarchive')
      .send(ids)
      .set('Authorization', token);
    expect(response.statusCode).toBe(400);
  });

  test('send ids that dont exist', async () => {
    const ids = ['111111111111111111111111', '111111111111111111111111'];
    const response = await request(Server)
      .post('/v1/interviews/unarchive')
      .send(ids)
      .set('Authorization', token);
    expect(response.statusCode).toBe(400);
  });

  test('send json data', async () => {
    const ids = {
      ids: ['111111111111111111111111', '111111111111111111111111']
    };
    const response = await request(Server)
      .post('/v1/interviews/unarchive')
      .send(ids)
      .set('Authorization', token);
    expect(response.statusCode).toBe(400);
  });
});
describe('POST interviews/archive', () => {
  test('archive an array of interviews', async () => {
    const ids = ['5cd404d41c9d440000eb7542'];
    const response = await request(Server)
      .post('/v1/interviews/archive')
      .send(ids)
      .set('Authorization', token);
    expect(response.statusCode).toBe(200);
  });

  test('send array without object ids', async () => {
    const ids = ['502', '5c7499803'];
    const response = await request(Server)
      .post('/v1/interviews/archive')
      .send(ids)
      .set('Authorization', token);
    expect(response.statusCode).toBe(400);
  });

  test('send ids that dont exist', async () => {
    const ids = ['111111111111111111111111', '111111111111111111111111'];
    const response = await request(Server)
      .post('/v1/interviews/archive')
      .send(ids)
      .set('Authorization', token);
    expect(response.statusCode).toBe(400);
  });

  test('send json data', async () => {
    const ids = {
      ids: ['111111111111111111111111', '111111111111111111111111']
    };
    const response = await request(Server)
      .post('/v1/interviews/archive')
      .send(ids)
      .set('Authorization', token);
    expect(response.statusCode).toBe(400);
  });
});

describe('GET interviews/archives', () => {
  test('Get list of all archived Interviews for a recruiter', async () => {
    const id = '5cd403861c9d440000eb7541';
    const response = await request(Server)
      .get(`/v1/interviews/${id}`)
      .set('Authorization', token);
    expect('Content-Type', /json/);
    expect(response.statusCode).toBe(200);
  });

  test('Send Invalid Auth Key', async () => {
    const id = 'abcd';
    const response = await request(Server)
      .get(`/v1/interviews/${id}`)
      .set('Authorization', token);
    expect(response.statusCode).toBe(403);
  });
});
