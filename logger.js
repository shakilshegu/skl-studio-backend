import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: 'error',
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.File({ filename: 'error.log' }),
    new transports.File({ filename: 'db-error.log', level: 'warning' })
  ]
});

export default logger;