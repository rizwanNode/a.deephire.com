
import CompaniesService from './companies.service';

import { toCSV } from '../../common/csv';

class DownloadService {
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
}

export default new DownloadService();
