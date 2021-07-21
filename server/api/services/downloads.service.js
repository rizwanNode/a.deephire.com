import CompaniesService from './companies.service';
import InterviewsService from './interviews.service';
import EventsService from './events.service';
import VideosService from './videos.service';
import { byParam } from './db.service';

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
          `"=DATEVALUE(MID(D${rowCount},1,10))+TIMEVALUE(MID(D${rowCount},12,8))"`,
        ]);
      } else {
        rows.push([
          member.email,
          member.name,
          member.user_metadata.team,
          member.last_login,
          `"=DATEVALUE(MID(D${rowCount},1,10))+TIMEVALUE(MID(D${rowCount},12,8))"`,
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
          // this style of loop also allows for
          // property assignment so that this
          // data can be read later.
          interviews[i].summary = {
            lastEventTime,
            started,
            invited,
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
            lastEventTime.toISOString(),
          ]);
        }
      }
    });

    return toCSV(header, rows);
  }

  async getCandidates(companyId, startDate, endDate) {
    const header = [
      'Recruiter Email',
      'Candidate Name',
      'Candidate Email',
      'Views',
      'Rating',
      'Last Activity'
    ];

    const candidates = await VideosService.all(companyId);

    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    const rows = await Promise.all(
      candidates.map(async candidate => {
        const search = {
          companyId,
          interviews: {
            $elemMatch: {
              $or: [
                { candidateEmail: candidate.candidateEmail },
                {
                  'liveInterviewData.candidateEmail': candidate.candidateEmail,
                },
              ],
            },
          },
        };

        const data = await byParam(search, 'shortlists');

        const { createdBy, clicks, interviews } = data;

        let interviewId = '';
        let avgRating = -1;
        let interviewTime = new Date(0);

        interviews.every(interview => {
          if (interview?.liveInterviewData) {
            if (interview.liveInterviewData?.candidateEmail === candidate.candidateEmail) {
              interviewId = interview.liveInterviewData._id;
              if (interview.liveInterviewData?.timestamp) {
                interviewTime = new Date(interview.liveInterviewData.timestamp);
              }
              if (interview.liveInterviewData?.fb) {
                let total = 0;
                let count = 0;
                Object.values(interview.liveInterviewData.fb).forEach(feedback => {
                  total += feedback.rating;
                  count += 1;
                });
                avgRating = total / count;
                return false;
              }
            }
          } else if (interview?.candidateEmail === candidate.candidateEmail) {
            interviewId = interview._id;
            if (interview?.fb) {
              let total = 0;
              let count = 0;
              Object.values(interview.fb).forEach(feedback => {
                total += feedback.rating;
                count += 1;
              });
              avgRating = total / count;
              return false;
            }
          }
          return true;
        });

        const interviewData = await EventsService.getEventsById(companyId, interviewId);

        let candidateName = '';

        interviewData.every(e => {
          if (e?.userName && e?.candidateEmail === candidate.candidateEmail) {
            candidateName = e.userName;
            return false;
          }
          return true;
        });

        return [
          createdBy,
          candidateName,
          candidate.candidateEmail,
          clicks.length,
          avgRating,
          interviewTime
        ];
      })
    );

    rows.filter(row => {
      const activity = row[5];
      return activity >= startDateObj && activity <= endDateObj;
    });

    return toCSV(header, rows);
  }
}

export default new DownloadService();
