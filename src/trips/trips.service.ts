import { Injectable, BadRequestException } from '@nestjs/common';

import { NewTripCreate } from './entities/newTripCreate.entity';

import { TripsRepository } from './trips.repository';
import { Trip } from '@prisma/client';

import axios from 'axios';

type TGeoAPIResponseLocationObject = {
  place_id: string;
  lat: string;
  lon: string;
};

type TLocation = {
  lat: number;
  lon: number;
};

@Injectable()
export class TripsService {
  constructor(private readonly tripsRepository: TripsRepository) {}
  async createTrip(newTrip: NewTripCreate): Promise<Trip> {
    const distance = await this.getDistance(
      newTrip.start_address,
      newTrip.destination_address,
    );
    const date = new Date(newTrip.date);
    return this.tripsRepository.create({
      ...newTrip,
      date,
      distance,
      day_aggregation: +`${date.getFullYear()}${
        date.getMonth() + 1 > 9
          ? date.getMonth() + 1
          : '0' + (date.getMonth() + 1).toString()
      }${date.getDate()}`,
    });
  }

  private async getDistance(a: string, b: string): Promise<number> {
    const [srcLocation, destLocation] = await Promise.all([
      this.getLocation(a),
      this.getLocation(b),
    ]);
    //Calculation done by: https://www.movable-type.co.uk/scripts/latlong.html
    const R = 6371e3; // metres
    const φ1 = (srcLocation.lat * Math.PI) / 180; // φ, λ in radians
    const φ2 = (destLocation.lat * Math.PI) / 180;
    const Δφ = ((destLocation.lat - srcLocation.lat) * Math.PI) / 180;
    const Δλ = ((destLocation.lon - srcLocation.lon) * Math.PI) / 180;

    const x =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));

    return +((R * c) / 1000).toFixed(2); // in kilometers
  }

  private async getLocation(a: string): Promise<TLocation> {
    const geoAPIURL = process.env.GEO_API_URL;
    if (!geoAPIURL) {
      throw new Error('Failed to retrieve geo api url');
    }
    const baseURL = new URL(geoAPIURL);
    baseURL.searchParams.append('q', a);
    baseURL.searchParams.append('format', 'jsonv2');
    const response = await axios.get(baseURL.href);
    const body: TGeoAPIResponseLocationObject[] = response.data;
    if (!body.length) {
      throw new BadRequestException('Invalid place');
    }
    const location = body[body.length - 1];
    return {
      lat: +location.lat,
      lon: +location.lon,
    };
  }
}
