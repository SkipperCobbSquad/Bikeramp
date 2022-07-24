import { Injectable } from '@nestjs/common';

import { StatsRepository } from './stats.repository';
import { TWeeklyStatistic } from './entities/weeklyStats.entity';
import { TMonthlyStatistic } from './entities/monthlyStats.entity';

@Injectable()
export class StatsService {
  //Spell rules: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules/PluralRules
  private suffixes = new Map([
    ['one', 'st'],
    ['two', 'nd'],
    ['few', 'rd'],
    ['other', 'th'],
  ]);
  constructor(private readonly statsRepository: StatsRepository) {}

  async getTotalInDateRange(from: Date, to: Date): Promise<TWeeklyStatistic> {
    const result = await this.statsRepository.aggregateTotalInDateRange(
      from,
      to,
    );
    return {
      total_distance: (result._sum.distance || 0) + 'km',
      total_price: (result._sum.price || 0) + 'PLN',
    };
  }

  async getByDayInDateRange(
    from: Date,
    to: Date,
  ): Promise<TMonthlyStatistic[]> {
    const result = await this.statsRepository.aggregateByDayInDateRange(
      from,
      to,
    );

    return result.map((stat) => ({
      day: `${this.extractMonthName(
        stat.day_aggregation,
      )}, ${this.formatOrdinals(this.extractDayOfMonth(stat.day_aggregation))}`,
      total_distance: stat._sum.distance + 'km',
      avg_ride: stat._avg.distance + 'km',
      avg_price: stat._avg.price + 'PLN',
    }));
  }

  public getFirstDayOfWeek(d: Date) {
    const date = new Date(d);
    const day = date.getDay();

    const diff = date.getDate() - day + (day === 0 ? -6 : 1);

    return new Date(date.getFullYear(), date.getMonth(), diff);
  }

  private extractMonthName(dayAggregation: number): string {
    const month = +dayAggregation.toString().slice(4, 6);
    return new Date(0, month, 0, 1).toLocaleString('default', {
      month: 'short',
    });
  }

  private extractDayOfMonth(dayAggregation: number) {
    const today = new Date();
    const monthYear = `${today.getFullYear()}${
      today.getMonth() + 1 > 9
        ? today.getMonth() + 1
        : '0' + (today.getMonth() + 1).toString()
    }`;
    return +dayAggregation.toString().slice(monthYear.length);
  }

  private formatOrdinals(n: number) {
    const pr = new Intl.PluralRules('en-US', { type: 'ordinal' });
    const rule = pr.select(n);
    const suffix = this.suffixes.get(rule);
    return `${n}${suffix}`;
  }
}
