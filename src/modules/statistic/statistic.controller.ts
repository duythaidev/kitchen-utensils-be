import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { StatisticService } from './statistic.service';
import { Roles, UserRole } from 'src/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
@Controller('statistics')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  @Roles(UserRole.Admin)
  @Get()
  getStatisticsThisMonth() {
    return this.statisticService.getStatisticsThisMonth();
  }

  @Roles(UserRole.Admin)
  @Get('period')
  getPeriodStatistics(@Query() query: any) {
    return this.statisticService.getPeriodStatistics(query);
  }
}