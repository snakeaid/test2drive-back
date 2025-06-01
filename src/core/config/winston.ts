import { registerAs } from '@nestjs/config';
import * as winston from 'winston';
import { WinstonModuleOptions } from 'nest-winston';

export default registerAs('winston', (): WinstonModuleOptions => {
  const colorize = process.env.NODE_ENV === 'development' ? [winston.format.colorize({ all: true, level: true })] : [];

  return {
    levels: {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
      verbose: 4,
    },
    transports: [
      new winston.transports.Console({
        level: process.env.LOG_LEVEL || 'error', // minimum level value (from 'error' to 'debug')
        format: winston.format.combine(
          winston.format.timestamp(),
          ...colorize,
          winston.format.printf((log) => {
            let module = log.module ? `[${log.module}]` : '';
            const trace = log.trace ? `\n[${log.trace}]` : '';
            const correlationId = log.correlationId ? `[${log.correlationId}] ` : '';

            module = colorize.length ? `\x1b[33m${module}\x1b[0m` : module;

            return `[${log.level}] ${correlationId} ${module} ${log.message} ${trace}`;
          }),
        ),
      }),
    ],
  };
});
