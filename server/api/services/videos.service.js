import { ObjectId } from 'mongodb';
import l from '../../common/logger';
import {
  editDocument,
  getInterviews,
  createUpdateVideo,
  byParam,
  deleteObject,
  deleteSubDocument
} from './db.service';
import { archiveValidator } from '../../common/helpers';

const customEdit = archive => async (collection, doc, data) => {
  const index = Array.isArray(data) ? data[0] : data;

  const deletingFrom = archive ? 'responses' : 'archivedResponses';
  const addingTo = archive ? 'archivedResponses' : 'responses';
  if (!doc[deletingFrom]) return;
  const videoToArchive = doc[deletingFrom][index];
  Array.isArray(doc[addingTo]);

  if (Array.isArray(doc[addingTo])) {
    doc[addingTo].push(videoToArchive);
  } else {
    // eslint-disable-next-line no-param-reassign
    doc[addingTo] = [videoToArchive];
  }
  doc[deletingFrom].splice(index, 1);
  await collection.save(doc);
};

class VideoService {
  all(companyId) {
    l.info(`${this.constructor.name}.all(${companyId}`);
    return getInterviews(companyId, 'interviews', 'videos');
  }

  async filter(companyId, candidateEmail) {
    l.info(`${this.constructor.name}.filter(${companyId}, ${candidateEmail}`);
    return getInterviews(companyId, 'interviews', 'videos').then(allVideos => {
      if (allVideos === 400) return Promise.resolve(allVideos);
      if (allVideos === 404) return Promise.resolve([]);
      if (candidateEmail) {
        return allVideos.filter(
          interview => interview.candidateEmail === candidateEmail
        );
      }
      return allVideos;
    });
  }

  archives(companyId) {
    l.info(`${this.constructor.name}.archives(${companyId}`);
    return getInterviews(companyId, 'interviews', 'videos', true);
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

  deleteIndividualQuestion(id, questionId) {
    l.info(
      `${this.constructor.name}.deleteIndividualQuestion(${id}, ${questionId})`
    );
    if (!ObjectId.isValid(id)) {
      return Promise.resolve(400);
    }
    const search = { _id: new ObjectId(id) };
    const match = {
      responses: { uuid: questionId },
      archivedResponses: { uuid: questionId }
    };

    return deleteSubDocument(search, match, 'videos');
  }

  archive(data) {
    l.info(`${this.constructor.name}.archive(${data})`);
    return archiveValidator(data, true, 'videos');
  }

  unarchive(data) {
    l.info(`${this.constructor.name}.unarchive(${data})`);
    return archiveValidator(data, false, 'videos');
  }

  archiveVideo(id, data) {
    l.info(`${this.constructor.name}.archiveVideo(${id},${data})`);
    if (!ObjectId.isValid(id)) {
      return Promise.resolve(400);
    }
    const search = { _id: new ObjectId(id) };
    return editDocument(search, data, customEdit(true), 'videos');
  }
  unarchiveVideo(id, data) {
    l.info(`${this.constructor.name}.unarchiveVideo(${id},${data})`);
    if (!ObjectId.isValid(id)) {
      return Promise.resolve(400);
    }
    const search = { _id: new ObjectId(id) };
    return editDocument(search, data, customEdit(false), 'videos');
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
