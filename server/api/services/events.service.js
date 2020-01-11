import l from '../../common/logger';
import { insert } from './db.service';

import clockworkIntegration from '../../common/clockwork';

class EventsService {
  started(data) {
    l.info(`${this.constructor.name}.started(${JSON.stringify(data)})`);
    insert({ event: 'started', ...data }, 'events');
    return clockworkIntegration(data);
  }

  victory(data) {
    l.info(`${this.constructor.name}.victory(${JSON.stringify(data)})`);
    insert({ event: 'completed', ...data }, 'events');
    return clockworkIntegration(data, true);
  }
}

export default new EventsService();
