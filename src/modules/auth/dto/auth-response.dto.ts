import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT access token (expires in 15 minutes)',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'JWT refresh token (expires in 7 days)',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'User information',
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'User UUID',
        example: '123e4567-e89b-12d3-a456-426614174000',
      },
      email: {
        type: 'string',
        format: 'email',
        description: 'User email',
        example: 'user@example.com',
      },
      firstName: {
        type: 'string',
        description: 'User first name',
        example: 'Іван',
        nullable: true,
      },
      lastName: {
        type: 'string',
        description: 'User last name',
        example: 'Петренко',
        nullable: true,
      },
    },
  })
  user: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
  };
} 