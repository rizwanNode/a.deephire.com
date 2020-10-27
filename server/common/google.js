import { google } from 'googleapis';

import l from './logger';

const clientEmail = process.env.GC_CLIENT_EMAIL;
let privateKey = process.env.GC_PRIVATE_KEY;
privateKey = privateKey.split('\\n').join('\n');

const sendCalendarInvites = async (
  interviewLink,
  companyName,
  attendees,
  interviewTime,
  candidateName,
  jobName,
  companyId
) => {
  const [startTime, endTime] = interviewTime;
  const auth = new google.auth.JWT(
    clientEmail,
    null,
    privateKey,
    ['https://www.googleapis.com/auth/calendar'],
    'interviews@deephire.com'
  );
  const calendar = google.calendar({ version: 'v3', auth });
  const event = {
    summary: `${companyName} Interview, ${candidateName}${
      jobName ? `, ${jobName}` : ''
    } `,
    start: {
      dateTime: startTime,
    },
    end: {
      dateTime: endTime,
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 1 * 60 },
        { method: 'popup', minutes: 10 },
      ],
    },
    attendees,
    description: `Join your video interview at ${interviewLink}
    
This will be a live video interview. Make sure you have either a smartphone, or a computer with a working camera & microphone before the interview.

This meeting will be automatically recorded for note-taking purposes. 

Join your video interview at ${interviewLink}`,
  };


  // HARDCODE
  const isAppleOne = companyId === '5e95d7d3aed1120001480d69' || companyId === '5f7f25460d77330001bc9b91';

  // HARDCODE
  const apponeEvent = {
    summary: `${companyName} Interview, ${candidateName}${
      jobName ? `, ${jobName}` : ''
    } `,
    start: {
      dateTime: startTime,
    },
    end: {
      dateTime: endTime,
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 1 * 60 },
        { method: 'popup', minutes: 10 },
      ],
    },
    attendees,
    description: `Join your video interview at ${interviewLink}
    
This will be a live video interview. Make sure you have either a smartphone, or a computer with a working camera & microphone before the interview.

This meeting will be automatically recorded for note-taking purposes. 

Please reach out if you have not recieved a link to the interview.`,
  };
  const scheduledEvent = await calendar.events
    .insert({
      calendarId: 'primary',
      resource: isAppleOne || apponeEvent,
      sendNotifications: true,
      sendUpdates: 'all',
    })
    .catch(e => l.err(e));
  l.info('Send Calendar Invites Status:', scheduledEvent.status);
};

export default sendCalendarInvites;
