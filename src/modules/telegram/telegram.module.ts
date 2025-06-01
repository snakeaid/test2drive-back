import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { CacheModule } from '../cache/cache.module';
import { TelegramNotifier } from './telegram.notifier';
import { BotAllowedUsersRepository } from './bot/users/bot-allowed-users.repository';
import { TelegramBotProviders } from './bot/telegram.bot';
import { ShipmentsModule } from '../shipments/shipments.module';

@Module({
  imports: [
    TelegrafModule, // CacheModule, ShipmentsModule
  ],
  providers: [
    // BotAllowedUsersRepository,
    TelegramNotifier,
    // ...TelegramBotProviders
  ],
  exports: [TelegramNotifier],
})
export class TelegramModule {}
