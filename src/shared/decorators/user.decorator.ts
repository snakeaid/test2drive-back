import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User as UserEntity } from '../../modules/users/entities/user.entity';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserEntity => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
); 