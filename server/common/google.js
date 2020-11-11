import { google } from 'googleapis';

import l from './logger';

const clientEmail = process.env.GC_CLIENT_EMAIL;
let privateKey = process.env.GC_PRIVATE_KEY;
privateKey = privateKey.split('\\n').join('\n');
const auth = new google.auth.JWT(
  clientEmail,
  null,
  privateKey,
  ['https://www.googleapis.com/auth/calendar'],
  'interviews@deephire.com'
);
const calendar = google.calendar({ version: 'v3', auth });

// Create or update calendar invites based on attendee's .eventId 
export async function handleCalendarInvite( 
  attendee, 
  interviewLink,
  companyName,
  interviewTime,
  candidateName,
  jobName,
  companyId
) {
  return (attendee.eventId) ? updateCalendarInvite(...arguments) : sendNewCalendarInvite(...arguments); 
};

const sendNewCalendarInvite = async ( 
  attendee, 
  interviewLink,
  companyName,
  interviewTime,
  candidateName,
  jobName,
  companyId
) => {
  // HARDCODE
  // const isAppleOne = companyId === '5e95d7d3aed1120001480d69' || companyId === '5f7f25460d77330001bc9b91';
  const isAppleOne = false;
  const eventTemplate = isAppleOne 
    ? getAppleOneEvent(companyName, candidateName, jobName, interviewTime, attendee)
    : getNormalEventTemplate(interviewLink, companyName, candidateName, jobName, interviewTime, attendee); 
  
  const scheduledEvent = await calendar.events
    .insert({
      calendarId: 'primary',
      resource: eventTemplate,
      sendNotifications: true,
      sendUpdates: 'all',
    })
    .catch(e => {
      l.err(e)
    });
    
    l.info(`Status of calendar invite for ${attendee.role} ${attendee.email}:`, scheduledEvent.status);
    
    attendee.eventId = scheduledEvent.data.id; 
    return attendee; 
}

const updateCalendarInvite = async ( 
  attendee, 
  interviewLink,
  companyName,
  interviewTime,
  candidateName,
  jobName,
  companyId
) => {
  // HARDCODE
  // const isAppleOne = companyId === '5e95d7d3aed1120001480d69' || companyId === '5f7f25460d77330001bc9b91';
  const isAppleOne = false;
  const eventTemplate = isAppleOne 
    ? getAppleOneEvent(companyName, candidateName, jobName, interviewTime, attendee)
    : getNormalEventTemplate(interviewLink, companyName, candidateName, jobName, interviewTime, attendee);

  const scheduledEvent = await calendar.events.update({
    calendarId: 'primary',
    resource: eventTemplate,
    sendNotifications: true,
    sendUpdates: 'all',
    eventId: attendee.eventId
  })
  .catch(e => {
    l.err(e)
  });

  l.info(`Update status of calendar invite for ${attendee.role} ${attendee.email}:`, scheduledEvent.status);
}

function getNormalEventTemplate(interviewLink, companyName, candidateName, jobName, interviewTime, attendee) {
  const [startTime, endTime] = interviewTime;
  const roleSpecificInterviewLink = `${interviewLink}?role=${attendee.role}`;
  return {
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
    attendees: [{ email: attendee.email }], // Invite specifically for this one attendee 
    description: `Join your video interview at ${roleSpecificInterviewLink}
        
    This will be a live video interview. Make sure you have either a smartphone, or a computer with a working camera & microphone before the interview.

    This meeting will be automatically recorded for note-taking purposes. 

    Join your video interview at ${roleSpecificInterviewLink}`,
  };
}

function getAppleOneEvent(companyName, candidateName, jobName, interviewTime, attendee) {
    const [startTime, endTime] = interviewTime;
    // HARDCODE
    return {
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
      attendees: [{ email: attendee.email }],
      description: `This will be a live video interview. Make sure you have either a smartphone, or a computer with a working camera & microphone before the interview.
  
  This meeting will be automatically recorded for note-taking purposes. 
  
  Please reach out if you have not received a link to the interview.`,
    };
}