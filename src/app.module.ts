import { Module } from '@nestjs/common';

import { TripsModule } from './trips/trips.module';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [TripsModule, StatsModule],
})
export class AppModule {}
