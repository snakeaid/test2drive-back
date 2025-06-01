import { ConfigModule, ConfigService } from '@nestjs/config';
import { WinstonModule, WinstonModuleOptions } from 'nest-winston';
import configs from './config/main';
import { RedisModule, RedisModuleOptions } from './redis';
import { DatabaseModule } from './database/database.module';

export const coreModules = [
  ConfigModule.forRoot({
    isGlobal: true,
    load: configs,
    envFilePath: `./env/${!process.env.NODE_ENV ? '.env.production' : `.env.${process.env.NODE_ENV}`}`,
  }),
  WinstonModule.forRootAsync({
    inject: [ConfigService],
    useFactory: async (configService: ConfigService): Promise<WinstonModuleOptions> => ({
      ...configService.get('winston'),
    }),
  }),
  RedisModule.forRootAsync({
    inject: [ConfigService],
    useFactory: async (configService: ConfigService): Promise<RedisModuleOptions> => ({
      ...configService.get('redis'),
    }),
  }),
  DatabaseModule,
];
