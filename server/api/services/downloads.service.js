
import CompaniesService from './companies.service';
import InterviewsService from './interviews.service';
import EventsService from './events.service';

import toCSV from '../../common/csv';

class DownloadService {
  // Worksheet 1
  async downloadUsers(companyId) {
    const header = ['Email', 'Name', 'Team', 'Last Login', 'Excel Date'];
    const team = await CompaniesService.getTeam(companyId);

    const rows = [];
    let rowCount = 2;

    team.forEach(member => {
      if (member.user_metadata?.team?.includes(',')) {
        rows.push([
          member.email,
          member.name,
          `"${member.user_metadata.team}"`,
          member.last_login,
          `"=DATEVALUE(MID(D${rowCount},1,10))+TIMEVALUE(MID(D${rowCount},12,8))"`
        ]);
      } else {
        rows.push([
          member.email,
          member.name,
          member.user_metadata.team,
          member.last_login,
          `"=DATEVALUE(MID(D${rowCount},1,10))+TIMEVALUE(MID(D${rowCount},12,8))"`
        ]);
      }
      rowCount += 1;
    });

    return toCSV(header, rows);
  }

  // Worksheet 2
  async downloadJobs(companyId, startDate, endDate) {
    const header = [
      'Recruiter Email',
      'Job Name',
      'Candidates Invited',
      'Created',
      'Last Event',
    ];

    const rows = [];

    const interviews = await InterviewsService.all(companyId);

    // this was done because .forEach doesn't allow for awaits.
    for (let i = 0; i < interviews.length; i += 1) {
      const interview = interviews[i];
      if (interview?._id) {
        // eslint-disable-next-line no-await-in-loop
        const { lastEventTime, started, invited } = await EventsService.getEventsSummaryById(
          companyId,
          interview._id,
          0,
          Date.now()
        );
        if (lastEventTime) {
          interviews[i].summary = {
            lastEventTime,
            started,
            invited
          };
        }
      }
    }

    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    interviews.forEach(interview => {
      if (interview?.timestamp && interview?.summary) {
        const date = new Date(interview.timestamp);
        let lastEventTime = new Date(interview.summary.lastEventTime);
        const created = new Date(interview.timestamp);
        if (lastEventTime.getTime() === 0) {
          lastEventTime = created;
        }
        if (date > startDateObj && date <= endDateObj) {
          rows.push([
            interview.createdBy,
            interview.interviewName,
            interview.summary.started + interview.summary.invited,
            created.toISOString(),
            lastEventTime.toISOString()
          ]);
        }
      }
    });

    return toCSV(header, rows);
  }
}

export default new DownloadService();
