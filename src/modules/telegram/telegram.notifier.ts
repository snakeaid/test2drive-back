import { Injectable, Logger } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';

@Injectable()
export class TelegramNotifier {
  private readonly chatId: number;
  private readonly logger: Logger;

  public constructor(@InjectBot() private readonly bot: Telegraf) {
    this.chatId = Number(process.env.TELEGRAM_CHAT_ID);
    this.logger = new Logger(TelegramNotifier.name);
  }

  public async sendMessage(messageText: string): Promise<void> {
    this.logger.log('Sending message...');
    this.logger.debug(`Message text: ${messageText}`);

    try {
      await this.bot.telegram.sendMessage(this.chatId, messageText, {
        parse_mode: 'HTML',
      });
    } catch (e) {
      this.logger.error(`Error sending message to telegram: ${e.message} ${e.stack}`);
    }
  }
}
