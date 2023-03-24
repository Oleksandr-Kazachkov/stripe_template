import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';

export type InvoiceDocument = HydratedDocument<Invoice>;

@Schema()
export class Invoice {
  @Prop({ type: Object })
  data: object;

  @Prop({ required: true })
  customerId: ObjectId;

  @Prop({ required: true })
  orderId: ObjectId;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
