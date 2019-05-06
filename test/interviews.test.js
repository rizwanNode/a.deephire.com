import request from 'supertest';
import Server from '../server/index';

beforeAll(async () => new Promise(resolve => setTimeout(() => resolve(), 1000)));
// afterAll(() => console.log(Server));

describe('GET interviews/:id', () => {
  test('Should get an interview by ID', async () => {
    const id = '5b9188393f5b070008de5c51';
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
});
