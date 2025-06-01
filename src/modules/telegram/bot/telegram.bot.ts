import { Injectable, OnApplicationBootstrap, Provider, UnauthorizedException } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf, Context } from 'telegraf';
import { TelegramBotAuthorizer } from './telegram-bot.authorizer';
import { ScopeLogger } from '../../logger/scope-logger';
import { LoggerService } from '../../logger/logger.service';
import Shipments from './shipments/main';
import Users from './users/main';

@Injectable()
class TelegramBot implements OnApplicationBootstrap {
  private readonly logger: ScopeLogger;

  public constructor(
    @InjectBot() private readonly bot: Telegraf,
    private readonly authorizer: TelegramBotAuthorizer,
    loggerService: LoggerService,
  ) {
    loggerService.setContext(TelegramBot.name);
    this.logger = loggerService.toScopeLogger();
  }

  public onApplicationBootstrap(): void {
    this.useAuthMiddleware();
    this.handleErrors();
  }

  private useAuthMiddleware(): void {
    this.bot.use(this.authMiddleware.bind(this));
  }

  private handleErrors(): void {
    this.bot.catch(this.errorHandler.bind(this));
  }

  private async authMiddleware(context: Context, next): Promise<void> {
    await this.authorizer.authorizeUser(context);
    await next();
  }

  private async errorHandler(error, context: Context): Promise<void> {
    if (error.constructor.name === UnauthorizedException.name) {
      await context.reply('🚫 ' + error.message);
    } else {
      await context.reply('❓Some unknown error occurred.');
      this.logger.error(error.message, error.stack);
    }
  }
}

export const TelegramBotProviders: Provider[] = [TelegramBotAuthorizer, TelegramBot, ...Shipments, ...Users];
