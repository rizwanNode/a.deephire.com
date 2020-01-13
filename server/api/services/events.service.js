import fetch from 'node-fetch';

import { ObjectId, ObjectID } from 'mongodb';

import l from '../../common/logger';
import { insert, byParam } from './db.service';

import clockworkIntegration from '../../common/clockwork';


const createObjectIds = data => {
  const { _id: interviewId } = data?.completeInterviewData?.interviewData || {};
  const { _id: companyId } = data?.completeInterviewData?.companyData || {};

  if (interviewId && ObjectId.isValid(interviewId)) {
    // eslint-disable-next-line no-param-reassign
    data.completeInterviewData.interviewData._id = new ObjectId(interviewId);
  }

  if (companyId && ObjectId.isValid(companyId)) {
    // eslint-disable-next-line no-param-reassign
    data.completeInterviewData.companyData._id = new ObjectId(companyId);
  }
  return data;
};

class EventsService {
  async started(data) {
    l.info(`${this.constructor.name}.started(${JSON.stringify(data)})`);
    const dataWithObjectIds = createObjectIds(data);
    const { candidateEmail } = data;
    const { _id } = data?.completeInterviewData?.interviewData || {};
    const search = { event: 'started', candidateEmail, completeInterviewData: { interviewData: { _id: new ObjectID(_id) } } };
    await insert({ event: 'started', ...dataWithObjectIds }, 'events');
    const events = await byParam(search, 'events');
    if (events && events.length === 1) {
      fetch('https://rest.deephire.com/v1/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataWithObjectIds) });
    }
    return clockworkIntegration(dataWithObjectIds);
  }

  victory(data) {
    l.info(`${this.constructor.name}.victory(${JSON.stringify(data)})`);
    const dataWithObjectIds = createObjectIds(data);
    insert({ event: 'completed', ...dataWithObjectIds }, 'events');
    return clockworkIntegration(dataWithObjectIds, true);
  }
}

export default new EventsService();
