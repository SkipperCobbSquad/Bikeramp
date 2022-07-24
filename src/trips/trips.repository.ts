import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma.service';
import { Trip } from '@prisma/client';

@Injectable()
export class TripsRepository {
  constructor(private prisma: PrismaService) {}
  async create(trip: Omit<Trip, 'id'>): Promise<Trip> {
    return this.prisma.trip.create({
      data: trip,
    });
  }
}
