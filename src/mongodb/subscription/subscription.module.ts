import { Module } from '@nestjs/common';
import { databaseProviders } from '../mongoose.provider';
import { subscriptionProviders } from './providers/subscription.provider';
import { SubscriptionService } from './subscription.service';

@Module({
  imports: [],
  controllers: [],
  providers: [
    ...databaseProviders,
    ...subscriptionProviders,
    SubscriptionService,
  ],
})
export class SubscriptionModule {}
