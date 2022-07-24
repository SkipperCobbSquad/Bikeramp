import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service';

@Injectable()
export class StatsRepository {
  constructor(private prisma: PrismaService) {}

  async aggregateTotalInDateRange(from: Date, to: Date) {
    return await this.prisma.trip.aggregate({
      where: {
        AND: [{ date: { gte: from } }, { date: { lte: to } }],
      },
      _sum: {
        distance: true,
        price: true,
      },
    });
  }

  async aggregateByDayInDateRange(from: Date, to: Date) {
    return await this.prisma.trip.groupBy({
      by: ['day_aggregation'],
      where: {
        AND: [{ date: { gte: from } }, { date: { lte: to } }],
      },
      _sum: {
        distance: true,
      },
      _avg: {
        distance: true,
        price: true,
      },
    });
  }
}
