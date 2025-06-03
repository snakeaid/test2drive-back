import { Controller, Get } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '../../shared/decorators/user.decorator';
import { User as UserEntity } from '../users/entities/user.entity';

@ApiTags('statistics')
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @ApiBearerAuth('JWT-auth')
  @Get('me/tests')
  @ApiOperation({ summary: 'Get user test statistics by category' })
  getTestStats(@User() user: UserEntity) {
    return this.statisticsService.getUserStatistics(user.id);
  }

  @ApiBearerAuth('JWT-auth')
  @Get('me/lectures')
  @ApiOperation({ summary: 'Get user lecture progress' })
  getLectureStats(@User() user: UserEntity) {
    return this.statisticsService.getLectureProgress(user.id);
  }

  @ApiBearerAuth('JWT-auth')
  @Get('me/summary')
  @ApiOperation({ summary: 'Get summary statistics for user' })
  getSummaryStats(@User() user: UserEntity) {
    return this.statisticsService.getSummary(user.id);
  }
}
