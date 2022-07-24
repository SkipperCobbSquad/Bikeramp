import { Module } from '@nestjs/common';

import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';
import { TripsRepository } from './trips.repository';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [],
  controllers: [TripsController],
  providers: [TripsService, TripsRepository, PrismaService],
})
export class TripsModule {}
