import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ObjectId } from 'mongodb';

export default class createInvoiceDto {
  @ApiProperty()
  @IsNotEmpty()
  data: Object;

  @ApiProperty()
  @IsNotEmpty()
  userId: ObjectId;

  @ApiProperty()
  @IsNotEmpty()
  orderId?: ObjectId;

  @ApiProperty()
  @IsNotEmpty()
  subscriptionId?: ObjectId;

  @ApiProperty()
  @IsNotEmpty()
  status: string;
}
