import { Injectable } from '@nestjs/common';
import { Action, Command, Ctx, Update } from 'nestjs-telegraf';
import { Context, Markup } from 'telegraf';
import { Context as ContextDecorator } from 'nestjs-telegraf/dist/decorators/params/context.decorator';
import { SceneContext } from 'telegraf/typings/scenes';
import { User } from './user.type';
import { BotAllowedUsersRepository } from './bot-allowed-users.repository';
import { TelegramBotAuthorizer } from '../telegram-bot.authorizer';
import { bold } from '../utils/formatting';

@Injectable()
@Update()
export class UsersMenu {
  public constructor(
    private readonly usersRepository: BotAllowedUsersRepository,
    private readonly authorizer: TelegramBotAuthorizer,
  ) {}

  @Command('users')
  private async usersMenu(@Ctx() context: Context): Promise<void> {
    await this.authorizer.authorizeAdmin(context);

    await context.reply(
      'What do you need to do?',
      Markup.inlineKeyboard([
        Markup.button.callback('📋 Get all users', 'getAllUsers'),
        Markup.button.callback('🧑🏼‍💻 Add a new user', 'addUser'),
        Markup.button.callback('🙅🏼 Delete a user', 'deleteUser'),
      ]),
    );
  }

  @Action('addUser')
  private async addUser(@ContextDecorator() context: SceneContext): Promise<void> {
    await this.authorizer.authorizeAdmin(context);

    await context.scene.enter('addUser');
  }

  @Action('deleteUser')
  private async deleteUser(@ContextDecorator() context: SceneContext): Promise<void> {
    await this.authorizer.authorizeAdmin(context);

    await context.scene.enter('deleteUser');
  }

  @Action('getAllUsers')
  private async getAllUsers(@Ctx() context: Context): Promise<void> {
    await this.authorizer.authorizeAdmin(context);

    const allUsers = await this.usersRepository.getAll();
    const usersReports = allUsers.map(this.getUserReport.bind(this));
    const usersReport = 'All users: \n' + usersReports.join('\n');

    await context.replyWithHTML(usersReport);
  }

  private getUserReport(user: User): string {
    return `${bold(user.username)}: ${user.role}`;
  }
}
