import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';

export type SubscriptionDocument = HydratedDocument<Subscription>;

@Schema({ versionKey: false })
export class Subscription {
  @Prop({ required: true })
  subscriptionId: string;

  @Prop({ default: null })
  collection_method: string;

  @Prop({ default: null })
  customerId: ObjectId;

  @Prop({ default: null })
  currency: string;

  @Prop({ type: Object })
  plan: object;

  @Prop({ default: false })
  cancel_at_period_end: Boolean;

  @Prop({ required: true })
  dateOfCreating: Date;

  @Prop({ default: 'active' })
  status: string;

  @Prop({ default: null })
  invoiceId: Array<ObjectId>;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
