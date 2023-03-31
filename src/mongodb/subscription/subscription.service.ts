import { Inject, Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import CreateSubcriptionDto from './dto/create.subscription.dto';
import {
  Subscription,
  SubscriptionDocument,
} from './schema/subscription.schema';

@Injectable()
export class SubscriptionService {
  constructor(
    @Inject('SUBSCRIPTION_MODEL')
    private subscriptionModel: Model<Subscription>,
  ) {}

  async createSubscription(
    createSubscriptionDto: CreateSubcriptionDto,
  ): Promise<Subscription> {
    if (createSubscriptionDto.plan) {
      const createdSubscription = new this.subscriptionModel({
        subscriptionId: createSubscriptionDto.subscriptionId,
        collection_method: createSubscriptionDto.collection_method,
        customerId: createSubscriptionDto.userId,
        plan: createSubscriptionDto.plan,
        dateOfCreating: createSubscriptionDto.dateOfCreating,
        cancel_at_period_end: false,
        customerStripeId: createSubscriptionDto.customerStripeId,
      });

      return createdSubscription.save();
    }
  }

  async findOneSubscriptionById(subscriptionId: string) {
    return await this.subscriptionModel.findOne({
      subscriptionId: subscriptionId,
    });
  }

  async findOneByCustomerId(customerId: string) {
    return await this.subscriptionModel.findOne({
      customerStripeId: customerId,
    });
  }

  async updateSubscription(
    subscription: SubscriptionDocument,
    status?: string,
    invoce?: ObjectId,
    subscriptionId?: string,
    collection_method?: string,
    plan?: object,
  ) {
    if (
      status === 'succeeded' ||
      status === 'paused' ||
      status === 'canceled'
    ) {
      subscription.status = status;
    }

    if (invoce) {
      subscription.invoiceId[subscription.invoiceId.length] = invoce;
    }

    if (subscriptionId) {
      subscription.subscriptionId = subscriptionId;
    }

    if (collection_method) {
      subscription.collection_method = collection_method;
    }

    if (plan) {
      subscription.plan = plan;
    }

    return subscription.save();
  }
}
