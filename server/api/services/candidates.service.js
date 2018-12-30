import l from '../../common/logger';
import db from './db.service';

class CandidatesService {
  all() {
    l.info(`${this.constructor.name}.all()`);
    return db.all('candidate_video_responses');
  }

  delete(userId, interviewId) {
    l.info(`${this.constructor.name}.delete(${userId}, ${interviewId} )`);
    return db.deleteCandidate(userId, interviewId, 'candidate_video_responses');
  }
}


export default new CandidatesService();

