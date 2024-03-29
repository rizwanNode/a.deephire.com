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
  return attendee.eventId
    ? updateCalendarInvite(...arguments)
    : sendNewCalendarInvite(...arguments);
}

const retryConfig = {
  // The amount of time to initially delay the retry
  retryDelay: 100,
  retry: 10,

  // The HTTP Methods that will be automatically retried.
  httpMethodsToRetry: ['GET', 'PUT', 'HEAD', 'POST', 'OPTIONS', 'DELETE'],

  // The HTTP response status codes that will automatically be retried.
  statusCodesToRetry: [
    [100, 199],
    [402, 403],
    [500, 599],
  ],
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
  const eventTemplate = getNormalEventTemplate(
    interviewLink,
    companyName,
    candidateName,
    jobName,
    interviewTime,
    attendee
  );
  const scheduledEvent = await calendar.events
    .insert(
      {
        calendarId: 'primary',
        resource: eventTemplate,
        sendNotifications: true,
        sendUpdates: 'all',
      },
      { retryConfig }
    )
    .catch(e => {
      l.error(e);
    });

  l.info(
    `Status of calendar invite for ${attendee.role} ${attendee.email}:`,
    scheduledEvent?.status
  );

  attendee.eventId = scheduledEvent?.data?.id;
  return attendee;
};

const updateCalendarInvite = async (
  attendee,
  interviewLink,
  companyName,
  interviewTime,
  candidateName,
  jobName,
  companyId
) => {
  const eventTemplate = getNormalEventTemplate(
    interviewLink,
    companyName,
    candidateName,
    jobName,
    interviewTime,
    attendee
  );
  const scheduledEvent = await calendar.events
    .update(
      {
        calendarId: 'primary',
        resource: eventTemplate,
        sendNotifications: true,
        sendUpdates: 'all',
        eventId: attendee.eventId,
      },
      { retryConfig }
    )
    .catch((e) => {
      l.err(e);
    });

  l.info(
    `Update status of calendar invite for ${attendee.role} ${attendee.email}:`,
    scheduledEvent?.status
  );
};

// based on https://stackoverflow.com/a/36961725/5178731
export const deleteCalendarInvite = async attendee => {
  const params = {
    eventId: attendee.eventId,
    calendarId: 'primary'
  };

  calendar.events.delete(params, err => {
    if (err) {
      l.info(`The calendar API returned an error: ${err}`);
      return;
    }

    l.info(`Calendar event for ${attendee.role} ${attendee.email} deleted.`);
  });
};

function getNormalEventTemplate(
  interviewLink,
  companyName,
  candidateName,
  jobName,
  interviewTime,
  attendee
) {
  const [startTime, endTime] = interviewTime;
  const roleSpecificInterviewLink = `${interviewLink}?role=${attendee.role}`;
  return {
    summary: `${companyName} Interview, ${candidateName}${jobName ? `, ${jobName}` : ''} `,
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
