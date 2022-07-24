import { Controller, Get } from '@nestjs/common';

import { StatsService } from './stats.service';
import { TWeeklyStatistic } from './entities/weeklyStats.entity';
import { TMonthlyStatistic } from './entities/monthlyStats.entity';

@Controller('/api/stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}
  @Get('/weekly')
  async getWeeklyStatistic(): Promise<TWeeklyStatistic> {
    const today = new Date();
    const firstDayOfWeek = this.statsService.getFirstDayOfWeek(today);
    return this.statsService.getTotalInDateRange(firstDayOfWeek, today);
  }
  @Get('/monthly')
  async getMonthlyStatistic(): Promise<TMonthlyStatistic[]> {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    return this.statsService.getByDayInDateRange(firstDayOfMonth, today);
  }
}
