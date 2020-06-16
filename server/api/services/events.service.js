import fetch from 'node-fetch';

import { ObjectId } from 'mongodb';

import l from '../../common/logger';
import { insert, byParam, newByParam } from './db.service';

import clockworkIntegration from '../../common/clockwork';
import frontlineIntegration from '../../common/bullhorn';


const createObjectIds = data => {
  const { _id: interviewId } = data?.completeInterviewData?.interviewData || {};
  const { _id: companyId } = data?.completeInterviewData?.companyData || {};
  // eslint-disable-next-line no-param-reassign
  data.candidateEmail = data.candidateEmail.toLowerCase();

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
    const search = { event: 'started', candidateEmail: candidateEmail.toLowerCase(), 'completeInterviewData.interviewData._id': new ObjectId(_id) };
    await insert({ event: 'started', ...dataWithObjectIds }, 'events');
    const events = await byParam(search, 'events');
    if (events && events.length === 1) {
      await fetch('https://rest.deephire.com/v1/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataWithObjectIds) });
    }
    await frontlineIntegration(data, 'started');

    return clockworkIntegration(dataWithObjectIds);
  }

  victory(data) {
    l.info(`${this.constructor.name}.victory(${JSON.stringify(data)})`);
    const dataWithObjectIds = createObjectIds(data);
    insert({ event: 'completed', ...dataWithObjectIds }, 'events');
    frontlineIntegration(data, 'completed');

    return clockworkIntegration(dataWithObjectIds);
  }


  clicked(data) {
    l.info(`${this.constructor.name}.clicked(${JSON.stringify(data)})`);
    const dataWithObjectIds = createObjectIds(data);

    insert({ event: 'clicked', ...dataWithObjectIds }, 'events');
    return frontlineIntegration(data, 'clicked');
  }


  invited(data) {
    l.info(`${this.constructor.name}.invited(${JSON.stringify(data)})`);
    // eslint-disable-next-line no-param-reassign
    delete data._id;
    insert({ event: 'invited', ...data }, 'events');
    return frontlineIntegration(data, 'invited');
  }

  async getEvents(companyId) {
    l.info(`${this.constructor.name}.clicked(${companyId})`);

    const companyIdMongo = new ObjectId(companyId);

    const completeInterviewSearch = { 'completeInterviewData.companyData._id': companyIdMongo };
    const invitedEventSearch = { companyId: companyIdMongo };
    const search = { $or: [completeInterviewSearch, invitedEventSearch] };
    const events = await newByParam(search, 'events');
    const resp = { events };
    return resp;
  }

  async getEventsById(companyId, interviewId) {
    l.info(`${this.constructor.name}.clicked(${companyId}, ${interviewId})`);

    if (!ObjectId.isValid(interviewId)) {
      return 400;
    }

    const companyIdMongo = new ObjectId(companyId);
    const interviewIdMongo = new ObjectId(interviewId);
    const completeInterviewSearch = { 'completeInterviewData.companyData._id': companyIdMongo, 'completeInterviewData.interviewData._id': interviewIdMongo };
    const invitedEventSearch = { companyId: companyIdMongo, interviewId: interviewIdMongo };
    const search = { $or: [completeInterviewSearch, invitedEventSearch] };
    const events = await newByParam(search, 'events');
    const resp = { events };
    return resp;
  }
}

export default new EventsService();

