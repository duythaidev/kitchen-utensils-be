import { Controller, Get, Query } from '@nestjs/common';
import { StatisticService } from './statistic.service';

@Controller('statistics')
export class StatisticController {
  constructor(private readonly statisticService: StatisticService) {}

  @Get()
  getStatisticsThisMonth() {
    return this.statisticService.getStatisticsThisMonth();
  }

  @Get('period')
  getPeriodStatistics(@Query() query: any) {
    return this.statisticService.getPeriodStatistics(query);
  }
}