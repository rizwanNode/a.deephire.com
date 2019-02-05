import { ObjectId } from 'mongodb';
import l from '../../common/logger';
import { getInterviews, createUpdateVideo, byParam, deleteObject } from './db.service';

class VideoService {
  all(email) {
    l.info(`${this.constructor.name}.all(${email}`);
    return getInterviews(email, 'videos');
  }

  insert(data) {
    l.info(`${this.constructor.name}.insert(${data})`);
    const { userId, interviewId } = data;
    const search = { userId, interviewId: ObjectId(interviewId) };
    const updateData = { ...data, ...search };
    return createUpdateVideo(search, updateData, 'videos');
  }

  byParam(id) {
    l.info(`${this.constructor.name}.byParam(${id})`);

    return byParam(id, 'videos', true);
  }

  delete(id) {
    l.info(`${this.constructor.name}.delete(${id})`);
    return deleteObject(id, 'videos');
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
