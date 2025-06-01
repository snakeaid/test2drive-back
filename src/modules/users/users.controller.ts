import {
  Controller,
  Get,
  Put,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from '../../shared/decorators/user.decorator';
import { User as UserEntity } from './entities/user.entity';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

@ApiTags('users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UsersController {
  public constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user information' })
  @ApiResponse({
    status: 200,
    description: 'Current user information retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          format: 'uuid',
          description: 'User UUID',
        },
        email: {
          type: 'string',
          format: 'email',
          description: 'User email',
        },
        firstName: {
          type: 'string',
          description: 'User first name',
          nullable: true,
        },
        lastName: {
          type: 'string',
          description: 'User last name',
          nullable: true,
        },
        profile: {
          type: 'object',
          description: 'User profile information',
          nullable: true,
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
          description: 'Account creation date',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
          description: 'Last update date',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async getCurrentUser(@User() user: UserEntity) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profile: user.profile,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({
    name: 'id',
    description: 'User UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'User information retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          format: 'uuid',
          description: 'User UUID',
        },
        email: {
          type: 'string',
          format: 'email',
          description: 'User email',
        },
        firstName: {
          type: 'string',
          description: 'User first name',
          nullable: true,
        },
        lastName: {
          type: 'string',
          description: 'User last name',
          nullable: true,
        },
        profile: {
          type: 'object',
          description: 'User profile information',
          nullable: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  async getUserById(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profile: user.profile,
    };
  }

  @Put('me/profile')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          format: 'uuid',
          description: 'Profile UUID',
        },
        phone: {
          type: 'string',
          description: 'User phone number',
          nullable: true,
        },
        dateOfBirth: {
          type: 'string',
          format: 'date',
          description: 'User date of birth',
          nullable: true,
        },
        avatarUrl: {
          type: 'string',
          format: 'url',
          description: 'User avatar URL',
          nullable: true,
        },
        userId: {
          type: 'string',
          format: 'uuid',
          description: 'Associated user UUID',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
  })
  async updateProfile(
    @User() user: UserEntity,
    @Body() updateProfileDto: UpdateUserProfileDto,
  ) {
    const updatedProfile = await this.usersService.updateProfile(
      user.id,
      updateProfileDto,
    );
    return updatedProfile;
  }
}