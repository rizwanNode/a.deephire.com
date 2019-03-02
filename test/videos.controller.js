import chai from 'chai';
import request from 'supertest';
import Server from '../server';

const expect = chai.expect;

describe('Candidates', () => {
  it('should get all candidates for a Recruiter based on Access Token', () =>
    request(Server)
    // request("http://localhost:3000")
      .get('/v1/candidates')
      .expect('Content-Type', /json/)
      .then(r => {
        expect(r.body)
          .to.be.an.an('array');
      }));
});
