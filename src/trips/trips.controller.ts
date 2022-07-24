import { Controller, Body, Post, HttpCode } from '@nestjs/common';

import { ValidationPipe } from '../validators/validation.pipe';
import { NewTripCreate } from './entities/newTripCreate.entity';

import { TripsService } from './trips.service';
import { Trip } from '@prisma/client';

@Controller('/api/trips')
export class TripsController {
  constructor(private readonly tripService: TripsService) {}
  @Post('/')
  @HttpCode(201)
  async createTrip(
    @Body(new ValidationPipe()) createTrip: NewTripCreate,
  ): Promise<Trip> {
    //Prepare Address
    createTrip.start_address = createTrip.start_address.trim();
    createTrip.destination_address = createTrip.destination_address.trim();
    return this.tripService.createTrip(createTrip);
  }
}
