import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';

export type SubscriptionDocument = HydratedDocument<Subscription>;

@Schema({ versionKey: false })
export class Subscription {
  @Prop({ default: '' })
  subscriptionId: string;

  @Prop({ default: null })
  collection_method: string;

  @Prop({ default: null })
  userId: ObjectId;

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

  @Prop({ default: null })
  customerStripeId: string;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
