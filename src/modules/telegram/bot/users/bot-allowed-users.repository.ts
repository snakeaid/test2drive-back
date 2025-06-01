import { Injectable } from '@nestjs/common';
import { User } from './user.type';
import { CacheService } from '../../../cache/cache.service';
import { Role } from './role.enum';

@Injectable()
export class BotAllowedUsersRepository {
  private readonly ALLOWED_USERS_KEY = 'telegram_allowed_users';

  public constructor(private readonly cache: CacheService) {}

  public async add(user: User): Promise<void> {
    const users = await this.getAll();
    users.push(user);
    await this.save(users);
  }

  public async remove(username: string): Promise<void> {
    const users = await this.getAll();
    const filteredUsers = users.filter((user) => user.username !== username);
    await this.save(filteredUsers);
  }

  public async getAll(): Promise<User[]> {
    const users = await this.cache.get<User[]>(this.ALLOWED_USERS_KEY);

    return users;
  }

  public async getByRole(role: Role): Promise<User[]> {
    const users = await this.cache.get<User[]>(this.ALLOWED_USERS_KEY);
    const usersWithRole = users.filter((user) => user.role === role);

    return usersWithRole;
  }

  private async save(users: User[]): Promise<void> {
    await this.cache.set(this.ALLOWED_USERS_KEY, users);
  }
}
