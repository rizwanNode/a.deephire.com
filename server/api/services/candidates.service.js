import l from '../../common/logger';
import db from './db.service';

class CandidatesService {
  all() {
    l.info(`${this.constructor.name}.all()`);
    return db.all('candidate_video_responses');
  }
  byParam(userId) {
    l.info(`${this.constructor.name}.byParam(${userId})`);
    const search = { userId };
    return db.byParam(search, 'candidates');
  }

  put(data) {
    l.info(`${this.constructor.name}.put(${data})`);
    return db.put(data, 'candidates');
  }

  delete(userId, interviewId) {
    l.info(`${this.constructor.name}.delete(${userId}, ${interviewId} )`);
    return db.deleteCandidate(userId, interviewId, 'candidate_video_responses');
  }
}


export default new CandidatesService();

