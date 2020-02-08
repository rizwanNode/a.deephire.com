import { ObjectId } from 'mongodb';
import fetch from 'node-fetch';

import { archiveValidator, duplicateValidator } from '../../common/helpers';
import l from '../../common/logger';
import { shortenLink } from '../../common/rebrandly';
import { byParam, deleteObject, insert, put } from './db.service';
import EventsService from './events.service';
import CompaniesService from './companies.service';


class InterviewsService {
  all(companyId) {
    l.info(`${this.constructor.name}.all(${companyId})`);
    const search = { companyId: new ObjectId(companyId) };
    return byParam(search, 'interviews');
  }

  archives(companyId) {
    l.info(`${this.constructor.name}.archives(${companyId})`);
    const search = { companyId: new ObjectId(companyId) };
    return byParam(search, 'interviews', false, true);
  }

  async insert(data, createdBy, companyId) {
    l.info(`$this.constructor.name}.insert(${data},${createdBy}, ${companyId})`);
    const objId = ObjectId();
    const longUrl = `https://interviews.deephire.com/?id=${objId.valueOf()}`;
    const shortUrl = await shortenLink(
      longUrl,
      'interview.deephire.com',
      `${createdBy}'s interview ${data.interviewName}`,
    );
    const shortList = { ...data, createdBy, _id: objId, shortUrl, companyId: new ObjectId(companyId) };
    return insert(shortList, 'interviews');
  }

  byParam(id) {
    l.info(`${this.constructor.name}.byParam(${id})`);
    return byParam(id, 'interviews', true);
  }

  delete(id) {
    l.info(`${this.constructor.name}.delete(${id})`);
    return deleteObject(id, 'interviews');
  }

  archive(data) {
    l.info(`${this.constructor.name}.archive(${data})`);
    return archiveValidator(data, true, 'interviews');
  }

  unarchive(data) {
    l.info(`${this.constructor.name}.unarchive(${data})`);
    return archiveValidator(data, false, 'interviews');
  }

  put(id, data) {
    l.info(`${this.constructor.name}.update(${id}, ${JSON.stringify(data)})`);
    delete data._id;
    return put(id, 'interviews', data, true, false);
  }

  duplicate(data) {
    l.info(`${this.constructor.name}.duplicate(${data})`);
    return duplicateValidator(data, 'interviews');
  }

  async invite(data, interviewId, createdBy, companyId) {
    l.info(`${this.constructor.name}.invite(${JSON.stringify(data)}, ${createdBy}, ${companyId})`);
    const event = { ...data, createdBy, interviewId: new ObjectId(interviewId), companyId: new ObjectId(companyId) };
    insert(event, 'invites_log');
    const { companyName } = await CompaniesService.byId(companyId);
    const { recipients } = data;
    recipients.forEach(candidateData => {
      const { email: candidateEmail, fullName: userName } = candidateData;
      const inviteData = { ...event, candidateEmail, userName, companyName };
      EventsService.invited(inviteData);
      fetch('https://rest.deephire.com/v1/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inviteData) });
    });


    const { messages } = data;
    return put(interviewId, 'interviews', { messages }, true, false);
  }
}

export default new InterviewsService();
