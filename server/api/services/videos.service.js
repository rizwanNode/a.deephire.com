import { ObjectId } from 'mongodb';
import l from '../../common/logger';
import { getInterviews, createUpdateVideo, byParam, deleteObject } from './db.service';
import { archiveValidator } from '../../common/helpers';

class VideoService {
  all(email) {
    l.info(`${this.constructor.name}.all(${email}`);
    return getInterviews(email, 'interviews', 'videos');
  }

  async filter(email, candidateEmail) {
    l.info(`${this.constructor.name}.filter(${email}, ${candidateEmail}`);
    return getInterviews(email, 'interviews', 'videos').then(allVideos => {
      if (allVideos == 400) return Promise.resolve(allVideos);
      if (allVideos == 404) return Promise.resolve([]);
      if (candidateEmail) {
        return allVideos.filter(interview => interview.candidateEmail === candidateEmail);
      }
      return allVideos;
    });
  }

  archives(email) {
    l.info(`${this.constructor.name}.archives(${email}`);
    return getInterviews(email, 'interviews', 'videos', true);
  }

  insert(data) {
    l.info(`${this.constructor.name}.insert(${data})`);
    const { candidateEmail, interviewId } = data;
    const search = { candidateEmail, interviewId: ObjectId(interviewId) };
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

  archive(data) {
    l.info(`${this.constructor.name}.archive(${data})`);
    return archiveValidator(data, true, 'videos');
  }

  unarchive(data) {
    l.info(`${this.constructor.name}.unarchive(${data})`);
    return archiveValidator(data, false, 'videos');
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
