import { Module } from '@nestjs/common';

import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import { StatsRepository } from './stats.repository';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [],
  controllers: [StatsController],
  providers: [StatsService, StatsRepository, PrismaService],
})
export class StatsModule {}
