import { Test } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';

import { TripsController } from '../trips.controller';
import { TripsService } from '../trips.service';
import { TripsRepository } from '../trips.repository';

describe('Trips service test', () => {
  let tripsService: TripsService;
  const mockedTripsRepository = {
    create: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TripsController],
      providers: [TripsService],
    })
      .useMocker((token) => {
        if (token === TripsRepository) {
          return mockedTripsRepository;
        }
        return {};
      })
      .compile();

    tripsService = moduleRef.get<TripsService>(TripsService);
  });

  it('Should create new trip', async () => {
    const today = '2022-07-20T10:00:00.000Z';
    const expectedCreatedTrip = {
      id: '8977e698-e0f9-4d3a-ae89-b25a1a137493',
      start_address: 'Gdynia, Polska',
      destination_address: 'Gdynia, Polska',
      distance: 0,
      price: 90,
      date: today,
      day_aggregation: 20220720,
    };
    mockedTripsRepository.create.mockReturnValueOnce(expectedCreatedTrip);

    const newTrip = {
      start_address: 'Gdynia, Polska',
      destination_address: 'Gdynia, Polska',
      price: 90,
      date: today,
    };

    await tripsService.createTrip(newTrip);

    const createCalledWith = mockedTripsRepository.create.mock.calls[0][0];
    const { id: _, ...expectedCalledCreateWith } = expectedCreatedTrip;

    expectedCalledCreateWith.date = new Date(
      expectedCalledCreateWith.date,
    ) as any;

    expect(createCalledWith).toEqual(expectedCalledCreateWith);
  });

  it('Should throw error for invalid address', async () => {
    const newTrip = {
      start_address: 'Gdynia, Niemcy',
      destination_address: 'Gdynia, Polska',
      price: 90,
      date: '2022-07-20T10:00:00.000Z',
    };

    await expect(tripsService.createTrip(newTrip)).rejects.toThrowError(
      BadRequestException,
    );
  });
});
