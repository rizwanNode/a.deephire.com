import fetch from 'node-fetch';
import { ObjectId } from 'mongodb';

import l from '../../common/logger';
import {
  roomEndedEvent,
  compositionAvailableEvent,
  recordingsDeletedEvent,
} from '../../common/webhooks';
import {
  byParam,
  byId,
  insert,
  putArrays,
  deleteSubDocument,
  put,
  deleteObject,
  findOne,
} from './db.service';
import { uploadS3Stream, deleteS3 } from '../../common/aws';
import sendCalendarInvites from '../../common/google';
import { stripeAddMinutes } from './stripe.service';

const TWILIO_API_KEY_SID = process.env.TWILIO_API_KEY_SID;
const TWILIO_API_KEY_SECRET = process.env.TWILIO_API_KEY_SECRET;
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;

const Twilio = require('twilio');

const client = new Twilio(TWILIO_API_KEY_SID, TWILIO_API_KEY_SECRET, {
  accountSid: TWILIO_ACCOUNT_SID,
});

const bucket = 'deephire.data.public';
const collection = 'live';

const deleteRecordings = async _id => {
  const results = await new LiveService().byId(_id);
  const { compositionSid } = results;
  // eslint-disable-next-line no-unused-expressions
  compositionSid?.forEach(id => {
    // i was scared to use the variables here incase this accidently gets modified
    deleteS3('deephire.data.public', `live/${id}.mp4`);
  });
};

const composeTwilioVideo = async (roomSid, roomName) => {
  // await new Promise(resolve => setTimeout(resolve, 20000));

  try {
    const composition = await client.video.compositions.create({
      roomSid,
      audioSources: '*',
      videoLayout: {
        grid: {
          video_sources: ['*'],
        },
      },
      statusCallback: 'https://a.deephire.com/v1/live/events',
      format: 'mp4',
    });
    l.info(`Created Composition with SID=${composition.sid}`);

    roomEndedEvent(roomName, true);
    const key = `live/${composition.sid}.mp4`;
    const data = {
      roomSid,
      compositionSid: composition.sid,
      recordingUrl: `https://s3.amazonaws.com/deephire.data.public/${key}`,
    };
    putArrays({ _id: roomName }, collection, data);
  } catch (err) {
    l.info(err);
    roomEndedEvent(roomName, false);
  }
};

const handleS3Upload = compositionSid => {
  const key = `live/${compositionSid}.mp4`;
  const uri = `https://video.twilio.com/v1/Compositions/${compositionSid}/Media?Ttl=3600`;

  client
    .request({
      method: 'GET',
      uri,
    })
    .then(async response => {
      const mediaLocation = response.body.redirect_to;

      // For example, download the media to a local file
      // const file = fs.createWriteStream('myFile.mp4');
      const resource = await fetch(mediaLocation);
      const stream = resource.body;
      // const buffer = await resource.buffer();
      const uploaded = await uploadS3Stream(bucket, key, stream, 'public-read');
      l.info(uploaded);
    })
    .catch(error => {
      l.error(`Error fetching /Media resource ${error}`);
    });
};

class LiveService {
  async byId(liveInterviewId) {
    l.info(`${this.constructor.name}.byId(${liveInterviewId})`);
    return byId(liveInterviewId, collection);
  }

  async getTemplate(companyId) {
    l.info(`${this.constructor.name}.getTemplates(${companyId})`);
    if (!ObjectId.isValid(companyId)) {
      return 400;
    }
    const search = { companyId: new ObjectId(companyId) };
    return findOne(search, 'templates');
  }
  async byParam(companyId) {
    l.info(`${this.constructor.name}.byParam(${companyId})`);
    const search = { companyId: new ObjectId(companyId) };
    const documents = await byParam(search, collection);
    return documents;
  }

  async addComment(liveId, body) {
    l.info(
      `${this.constructor.name}.addComment(${liveId}),${JSON.stringify(body)})`
    );

    const commentId = ObjectId.isValid(body._id)
      ? new ObjectId(body._id)
      : new ObjectId();
    const data = { comments: { ...body, _id: commentId } };
    const addedComment = await putArrays({ _id: liveId }, collection, data);
    if (addedComment === 200) {
      return { _id: liveId, commentId };
    }
    return addedComment;
  }

  async deleteComment(liveId, commentId) {
    l.info(`${this.constructor.name}.delete(${liveId}, ${commentId})`);

    if (!ObjectId.isValid(commentId)) {
      return Promise.resolve(400);
    }

    const search = { _id: liveId };
    l.info(search);

    const match = { comments: { _id: new ObjectId(commentId) } };
    return deleteSubDocument(search, match, collection);
  }

  async insert(companyId, createdBy, userProfile, body) {
    l.info(
      `${
        this.constructor.name
      }.insert(${companyId}, ${createdBy}, ${JSON.stringify(
        userProfile
      )}, ${JSON.stringify(body)})`
    );
    const { name } = userProfile;
    const companyData = await byId(companyId, 'companies');
    const { companyName } = companyData;

    const {
      interviewTime,
      candidateEmail,
      clientEmail,
      jobName,
      candidateName,
      interviewType
    } = body;
    const attendees = [
      { email: candidateEmail },
      { email: clientEmail || createdBy },
    ];

    // const lowerCaseUnderscoreCompanyName = companyName.replace(/\s+/g, '-').toLowerCase();
    // const randomDigits = Math.floor(Math.random() * 100000000);
    // const roomName = `${lowerCaseUnderscoreCompanyName}-${randomDigits}`;
    const _id = new ObjectId();
    let interviewLink = `https://live.deephire.com/room/${_id}`;

    // HARDCODED for APPLEONE
    // eslint-disable-next-line camelcase
    if (
      userProfile?.user_id === 'auth0|5f7f2546ec8f030075525516' ||
      companyId === '5f960ca1aaf3e97ca402a51d'
    ) {
      interviewLink = `https://beta.live.deephire.com/room/${_id}`;
    }
    const urls = {
      interviewLink,
      recruiterUrl: `${interviewLink}?role=recruiter`,
      candidateUrl: `${interviewLink}?role=candidate`,
      clientUrl: `${interviewLink}?role=client`,
      viewUrl: `https://recruiter.deephire.com/one-way/candidates/candidate/?liveid=${_id}`,
    };
    let { recruiterTemplate, clientTemplate, candidateTemplate } = body;
    const isClientTemplateExcluded =
      interviewType === 'client' && (!clientTemplate || !candidateTemplate);
    const isRecruiterTemplateExcluded =
      interviewType === 'recruiter' && !recruiterTemplate;


    if (isClientTemplateExcluded) {
      const template = await this.getTemplate(companyId);
      clientTemplate = template?.clientTemplates?.template1?.html;
      candidateTemplate = template?.candidateTemplates?.template1?.html;
    }

    if (isRecruiterTemplateExcluded) {
      const template = await this.getTemplate(companyId);
      recruiterTemplate = template?.recruiterTemplates?.template1?.html;
    }
    const data = {
      clientTemplate,
      candidateTemplate,
      recruiterTemplate,
      ...body,
      _id,
      createdBy,
      companyId: new ObjectId(companyId),
      roomName: _id,
      ...urls,
      companyName,
      recruiterName: name,
    };
    await sendCalendarInvites(
      interviewLink,
      companyName,
      attendees,
      interviewTime,
      candidateName,
      jobName,
      companyId
    );
    return insert(data, collection);
  }

  async handleTwilio(body) {
    l.info(`${this.constructor.name}.handleTwilio(${JSON.stringify(body)})`);
    const {
      StatusCallbackEvent,
      RoomSid,
      CompositionSid,
      RoomName,
      ParticipantDuration,
    } = body;
    if (StatusCallbackEvent === 'room-ended') {
      await composeTwilioVideo(RoomSid, RoomName);
    }

    // if (StatusCallbackEvent === 'composition-started') {
    // }

    if (StatusCallbackEvent === 'participant-disconnected') {
      const { companyId } = await this.byId(RoomName);
      return stripeAddMinutes(companyId, ParticipantDuration);
    }

    if (StatusCallbackEvent === 'composition-enqueued') {
      // returns this just because its what the frontend expects.
      // it should be changed to return a recording status of composition-enqued
      put(
        { compositionSid: CompositionSid },
        collection,
        { recordingStatus: 'composition-progress' },
        false,
        false
      );
    }

    if (StatusCallbackEvent === 'composition-progress') {
      // const { PercentageDone, SecondsRemaining } = body;
      put(
        { compositionSid: CompositionSid },
        collection,
        { recordingStatus: StatusCallbackEvent },
        false,
        false
      );
    }

    if (StatusCallbackEvent === 'composition-available') {
      handleS3Upload(CompositionSid);
      put(
        { compositionSid: CompositionSid },
        collection,
        { recordingStatus: StatusCallbackEvent },
        false,
        false
      );
      await compositionAvailableEvent(CompositionSid);
    }

    return 200;
  }

  put(_id, data) {
    l.info(`${this.constructor.name}.put(${_id}, ${JSON.stringify(data)})`);
    return put({ _id }, 'live', data);
  }

  async deleteRecordings(_id) {
    l.info(`${this.constructor.name}.deleteRecordings(${_id})`);
    await deleteRecordings(_id);
    const data = { recordingUrl: [] };
    const resp = await put({ _id }, collection, data);
    recordingsDeletedEvent(_id);
    return resp;
  }

  async delete(_id) {
    l.info(`${this.constructor.name}.delete(${_id}`);

    await deleteRecordings(_id);
    return deleteObject(_id, 'live');
  }

  putParticipant(_id, data) {
    l.info(
      `${this.constructor.name}.putParticipant(${_id}, ${JSON.stringify(data)})`
    );
    const { participantName } = data;
    // eslint-disable-next-line no-param-reassign
    delete data.participantName;
    const nestedProperty = `participants.${participantName}`;
    const updateData = {
      [nestedProperty]: data,
    };
    return put({ _id }, 'live', updateData);
  }
  // putDeviceInfo(_id, data) {
  //   l.info(`${this.constructor.name}.update(${_id}, ${JSON.stringify(data)})`);
  //   return putArrays({ _id }, 'live', data);
  // }
}

export default new LiveService();
