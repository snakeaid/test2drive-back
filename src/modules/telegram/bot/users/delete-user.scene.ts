import { Injectable } from '@nestjs/common';
import { Wizard, WizardStep } from 'nestjs-telegraf';
import { BotAllowedUsersRepository } from './bot-allowed-users.repository';
import { Context as ContextDecorator } from 'nestjs-telegraf/dist/decorators/params/context.decorator';
import { WizardContext } from 'telegraf/typings/scenes';
import { bold } from '../utils/formatting';

@Injectable()
@Wizard('deleteUser')
export class DeleteUserScene {
  public constructor(private readonly usersRepository: BotAllowedUsersRepository) {}

  @WizardStep(1)
  public async askUsername(@ContextDecorator() context: WizardContext): Promise<void> {
    await context.reply('❔Please specify the username to be deleted.');
    context.wizard.next();
  }

  @WizardStep(2)
  public async deleteUser(@ContextDecorator() context: WizardContext): Promise<void> {
    const username = (context.message as any).text;
    await this.usersRepository.remove(username);
    await context.replyWithHTML(`✅ Removed user ${bold(username)} successfully.`);
    await context.scene.leave();
  }
}
