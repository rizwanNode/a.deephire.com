import fetch from 'node-fetch';
import { ObjectID } from 'mongodb';


import l from '../../common/logger';
import { byParam, byId, insert, putArrays, put } from './db.service';
import { uploadS3Stream } from '../../common/aws';
import sendCalendarInvites from '../../common/google';


const TWILIO_API_KEY_SID = process.env.TWILIO_API_KEY_SID;
const TWILIO_API_KEY_SECRET = process.env.TWILIO_API_KEY_SECRET;
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;

const Twilio = require('twilio');

const client = new Twilio(TWILIO_API_KEY_SID, TWILIO_API_KEY_SECRET, { accountSid: TWILIO_ACCOUNT_SID });

// const collection = 'live';
const bucket = 'deephire.data.public';
const collection = 'live';


const composeTwilioVideo = async (roomSid, roomName) => {
  await new Promise(resolve => setTimeout(resolve, 20000));
  const composition = await client.video.compositions
    .create({
      roomSid,
      audioSources: '*',
      videoLayout: {
        grid: {
          video_sources: ['*']
        }
      },
      statusCallback: 'https://a.deephire.com/v1/live/events',
      format: 'mp4'
    }).catch(err => l.error(err));
  l.info(`Created Composition with SID=${composition.sid}`);
  const key = `live/${composition.sid}.mp4`;
  const data = { roomSid, compositionSid: composition.sid, recordingUrl: `https://s3.amazonaws.com/deephire.data.public/${key}` };
  putArrays({ roomName }, collection, data);
};


const handleS3Upload = compositionSid => {
  const key = `live/${compositionSid}.mp4`;
  const uri = `https://video.twilio.com/v1/Compositions/${compositionSid}/Media?Ttl=3600`;

  client.request({
    method: 'GET',
    uri
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
  async byParam(companyId) {
    l.info(`${this.constructor.name}.byParam(${companyId})`);
    const search = { companyId: new ObjectID(companyId) };
    const documents = await byParam(search, collection);
    return documents;
  }

  async insert(companyId, createdBy, userProfile, body) {
    l.info(`${this.constructor.name}.byParam(${companyId}, ${createdBy}, ${userProfile}, ${JSON.stringify(body)})`);
    const { name } = userProfile;
    const companyData = await byId(companyId, 'companies');
    const { companyName } = companyData;


    const { interviewTime, candidateEmail } = body;
    const attendees = [{ email: candidateEmail }, { email: createdBy }];
    // const lowerCaseUnderscoreCompanyName = companyName.replace(/\s+/g, '-').toLowerCase();
    // const randomDigits = Math.floor(Math.random() * 100000000);
    // const roomName = `${lowerCaseUnderscoreCompanyName}-${randomDigits}`;
    const liveId = new ObjectID();
    const interviewLink = `https://live.deephire.com/room/${liveId}`;
    const data = { ...body, createdBy, companyId: new ObjectID(companyId), roomName: liveId, interviewLink, companyName, recruiterName: name };
    await sendCalendarInvites(interviewLink, companyName, attendees, interviewTime);
    return insert(data, collection);
  }

  async handleTwilio(body) {
    l.info(`${this.constructor.name}.handleTwilio(${JSON.stringify(body)})`);
    const { StatusCallbackEvent, RoomSid, CompositionSid, RoomName } = body;
    if (StatusCallbackEvent === 'room-ended') {
      await composeTwilioVideo(RoomSid, RoomName);
    }

    // if (StatusCallbackEvent === 'composition-started') {
    // }

    if (StatusCallbackEvent === 'composition-progress') {
      // const { PercentageDone, SecondsRemaining } = body;
      put({ compositionSid: CompositionSid }, collection, { recordingStatus: StatusCallbackEvent }, false, false);
    }


    if (StatusCallbackEvent === 'composition-available') {
      handleS3Upload(CompositionSid);
      put({ compositionSid: CompositionSid }, collection, { recordingStatus: StatusCallbackEvent }, false, false);
    }


    return 200;
  }
}


export default new LiveService();
