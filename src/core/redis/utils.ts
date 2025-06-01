import { Logger } from '@nestjs/common';

const logger = new Logger('Redis');

export const redisConsole = (...params: string[]): void => logger.log(params.join(''));
