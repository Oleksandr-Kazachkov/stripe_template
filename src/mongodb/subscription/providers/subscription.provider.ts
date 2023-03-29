import { Connection } from 'mongoose';
import { SubscriptionSchema } from '../schema/subscription.schema';

export const subscriptionProviders = [
  {
    provide: 'SUBSCRIPTION_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Subscription', SubscriptionSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
