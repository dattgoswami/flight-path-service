import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'server.log' }),
  ],
});

export function logRequest(req, res, next) {
  logger.info(`Received request: ${req.method} ${req.url}`);
  next();
}

export default logger;
