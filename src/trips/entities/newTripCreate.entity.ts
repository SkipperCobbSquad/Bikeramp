import { IsString, IsNumber, IsDateString } from 'class-validator';
export class NewTripCreate {
  @IsString()
  start_address: string;
  @IsString()
  destination_address: string;
  @IsNumber()
  price: number;
  @IsDateString()
  date: string;
}
