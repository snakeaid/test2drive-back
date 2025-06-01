import { Injectable } from '@nestjs/common';
import { Action, Command, Ctx, Update } from 'nestjs-telegraf';
import { Context, Markup } from 'telegraf';
import { ShipmentsService } from '../../../shipments/shipments.service';
import { TelegramBotAuthorizer } from '../telegram-bot.authorizer';
import { link } from '../utils/formatting';

@Injectable()
@Update()
export class ShipmentsMenu {
  public constructor(
    private readonly shipmentsService: ShipmentsService,
    private readonly authorizer: TelegramBotAuthorizer,
  ) {}

  @Command('shipments')
  private async shipmentsMenu(@Ctx() context: Context): Promise<void> {
    await this.authorizer.authorizeUser(context);

    await context.reply(
      'What do you need to do?',
      Markup.inlineKeyboard([Markup.button.callback('📦 Create new shipment', 'createShipment')]),
    );
  }

  @Action('createShipment')
  private async createShipment(@Ctx() context: Context): Promise<void> {
    await this.authorizer.authorizeUser(context);

    await context.reply('Creating new shipment...');
    const shipmentUrl = await this.shipmentsService.createShipment();
    await context.replyWithHTML(`✅ Created new ${link(shipmentUrl, 'shipment')}.`);
  }
}
