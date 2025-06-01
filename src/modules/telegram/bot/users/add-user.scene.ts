import { Injectable } from '@nestjs/common';
import { Wizard, WizardStep } from 'nestjs-telegraf';
import { BotAllowedUsersRepository } from './bot-allowed-users.repository';
import { Context as ContextDecorator } from 'nestjs-telegraf/dist/decorators/params/context.decorator';
import { WizardContext } from 'telegraf/typings/scenes';
import { Role } from './role.enum';
import { User } from './user.type';
import { italic } from '../utils/formatting';

@Injectable()
@Wizard('addUser')
export class AddUserScene {
  public constructor(private readonly usersRepository: BotAllowedUsersRepository) {}

  @WizardStep(1)
  public async askUserInfo(@ContextDecorator() context: WizardContext): Promise<void> {
    await context.replyWithHTML(
      `❔Please specify the username and role in the following format: ${italic('username, role')}\n` +
        `Accepted roles are ${italic('admin')} and ${italic('user')}.`,
    );
    context.wizard.next();
  }

  @WizardStep(2)
  public async addUser(@ContextDecorator() context: WizardContext): Promise<void> {
    const userInfo = (context.message as any).text;
    const [username, role] = userInfo.split(',');
    const normalizedRole = role.replace(' ', '');
    const normalizedUsername = username.replace('@', '');

    if (!Object.values(Role).includes(normalizedRole)) {
      await context.reply('❗️Invalid role name!');
    } else {
      const user: User = {
        username: normalizedUsername,
        role: normalizedRole as Role,
      };
      await this.usersRepository.add(user);
      await context.reply(`✅ Added ${username} successfully.`);
    }
    await context.scene.leave();
  }
}
