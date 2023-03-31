import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { ObjectId } from 'mongodb';

export default class CreateSubcriptionDto {
  @ApiProperty()
  @IsString()
  subscriptionId: string;

  @ApiProperty()
  @IsString()
  collection_method: string;

  @ApiProperty()
  @IsNotEmpty()
  userId: ObjectId;

  @ApiProperty()
  plan: object;

  @ApiProperty()
  dateOfCreating: number;

  @ApiProperty()
  invoiceId: Array<ObjectId>;

  @ApiProperty()
  customerStripeId: string;
}
