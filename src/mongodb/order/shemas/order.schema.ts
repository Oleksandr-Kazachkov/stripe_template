import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<Order>;

@Schema({ versionKey: false })
export class Order {
  @Prop({ default: null })
  products: Array<object>;

  @Prop({ required: true })
  customerStripeId: string;

  @Prop({ default: null })
  invoce: Array<ObjectId>;

  @Prop({ required: true })
  customerId: ObjectId;

  @Prop({ default: null })
  status: string;

  @Prop({ default: null })
  mode: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
