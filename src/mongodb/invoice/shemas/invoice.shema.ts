import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';

export type InvoiceDocument = HydratedDocument<Invoice>;

@Schema({ versionKey: false })
export class Invoice {
  @Prop({ type: Object })
  data: object;

  @Prop({ required: true })
  userId: ObjectId;

  @Prop()
  orderId?: ObjectId;

  @Prop()
  subscriptionId?: ObjectId;

  @Prop({ required: true })
  status: string;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
