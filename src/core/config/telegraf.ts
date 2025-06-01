import { registerAs } from '@nestjs/config';
import { TelegrafModuleOptions } from 'nestjs-telegraf';
import { session } from 'telegraf';

export default registerAs(
  'telegraf',
  (): TelegrafModuleOptions => ({
    token: process.env.TELEGRAM_BOT_TOKEN,
    middlewares: [session()],
  }),
);
