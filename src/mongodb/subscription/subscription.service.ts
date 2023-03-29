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
        customerId: createSubscriptionDto.customerId,
        currency: createSubscriptionDto.currency,
        plan: createSubscriptionDto.plan,
        dateOfCreating: createSubscriptionDto.dateOfCreating,
        cancel_at_period_end: false,
      });
      return createdSubscription.save();
    }
  }

  async findOneSubscriptionById(subscriptionId: string) {
    return await this.subscriptionModel.findOne({
      subscriptionId: subscriptionId,
    });
  }

  async updateSubscryption(
    subscription: SubscriptionDocument,
    status?: string,
    invoce?: ObjectId,
  ) {
    if (status) {
      subscription.cancel_at_period_end = true;
      subscription.status = status;
    }

    if (invoce) {
      subscription.invoiceId[subscription.invoiceId.length] = invoce;
    }

    return subscription.save();
  }
}
