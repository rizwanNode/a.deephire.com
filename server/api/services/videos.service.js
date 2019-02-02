import { ObjectId } from 'mongodb';
import l from '../../common/logger';
import db from './db.service';

class VideoService {
  all(email) {
    l.info(`${this.constructor.name}.all(${email}`);
    return db.getInterviews(email, 'videos_test');
  }

  async insert(data, email) {
    l.info(`${this.constructor.name}.insert(${data},${email})`);
    const { userId, interviewId } = data;
    const search = { userId, interviewId: ObjectId(interviewId) };
    const updateData = { ...data, ...search };
    return db.createUpdateVideo(search, updateData, 'videos_tests');
  }

  byParam(id) {
    l.info(`${this.constructor.name}.byParam(${id})`);

    return db.byParam(id, 'videos_test', true);
  }
}

export default new VideoService();

// we want a lookup based on the interviewId
// see if something with that interviewId and userId already exists
// if not, create new
// if so, see if current interview_question is in array now
// if so, update it,
// if not
// append to end of array
