// import pino from 'pino';
import { createLogger, format, transports } from 'winston';

// const l = pino({
//   name: process.env.APP_ID,
//   level: process.env.LOG_LEVEL,
// });

const httpsTransportOptions = {
  host: 'http-intake.logs.datadoghq.com',
  path: `/v1/input/${process.env.DATADOG_APIKEY}?ddsource=nodejs&service=a.deephire.com`,
  ssl: true
};

const l = createLogger({
  level: 'info',
  exitOnError: false,
  format: format.json(),
  transports: [
    new transports.Http(httpsTransportOptions),
  ],
});

export default l;
