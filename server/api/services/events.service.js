import l from '../../common/logger';

import clockworkIntegration from '../../common/clockwork';

class EventsService {
  started(data) {
    l.info(`${this.constructor.name}.started(${JSON.stringify(data)})`);
    return clockworkIntegration(data);
  }

  victory(data) {
    l.info(`${this.constructor.name}.victory(${JSON.stringify(data)})`);
    return clockworkIntegration(data, true);
  }
}

export default new EventsService();
