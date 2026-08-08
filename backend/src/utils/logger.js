import pino from 'pino';
import { config } from '../config/env.js';

const isDev = config.nodeEnv === 'development';

const loggerConfig = {
  level: isDev ? 'debug' : 'info',
  redact: {
    paths: [
      'req.headers.authorization',
      'req.body.password',
      'req.body.token',
      'password',
      'token',
      'jwt'
    ],
    remove: true,
  },
  ...(isDev && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    },
  }),
};

export const logger = pino(loggerConfig);
