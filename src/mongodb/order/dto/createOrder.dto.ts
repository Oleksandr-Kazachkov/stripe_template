import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { ObjectId } from 'mongodb';

export default class createOrderDto {
  @ApiProperty()
  products: Array<string>;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  customerId: ObjectId;

  @ApiProperty()
  @IsString()
  customerStripeId: string;

  @ApiProperty()
  invoce: Array<string>;

  @ApiProperty()
  mode: string;
}
