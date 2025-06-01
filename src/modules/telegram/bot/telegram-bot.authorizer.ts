import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Context } from 'telegraf';
import { Role } from './users/role.enum';
import { BotAllowedUsersRepository } from './users/bot-allowed-users.repository';

@Injectable()
export class TelegramBotAuthorizer {
  public constructor(private readonly usersRepository: BotAllowedUsersRepository) {}

  public async authorizeUser(context: Context): Promise<void> {
    const fromUsername = context.from.username;
    const allowedUsers = await this.usersRepository.getAll();
    const allowedUsernames = allowedUsers.map((user) => user.username);
    if (!allowedUsernames.includes(fromUsername)) {
      throw new UnauthorizedException("You don't have access to this bot.");
    }
  }

  public async authorizeAdmin(context: Context): Promise<void> {
    const fromUsername = context.from.username;
    const admins = await this.usersRepository.getByRole(Role.Admin);
    const adminUsernames = admins.map((admin) => admin.username);
    if (!adminUsernames.includes(fromUsername)) {
      throw new UnauthorizedException("You don't have access to this action.");
    }
  }
}
