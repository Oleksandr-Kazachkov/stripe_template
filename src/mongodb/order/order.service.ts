import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Order } from './shemas/order.schema';
import createOrderDto from './dto/createOrder.dto';
import { ObjectId } from 'mongodb';

@Injectable()
export class OrderService {
  constructor(
    @Inject('ORDER_MODEL')
    private orderModel: Model<Order>,
  ) {}

  async createOrder(createOrderDto: createOrderDto): Promise<Order> {
    const createdOrder = new this.orderModel(createOrderDto);
    return createdOrder.save();
  }

  async updateOneOrder(
    customerStripeId?: string,
    invoiceRes?: ObjectId,
    status?: string,
    mode?: string,
  ) {
    const order = await this.orderModel.findOne({
      customerStripeId: customerStripeId,
    });

    if (invoiceRes) {
      order.invoce[order.invoce.length] = invoiceRes;
    }

    if (
      (order.status != 'succeeded' && status) ||
      status === 'paused' ||
      status === 'canceled'
    ) {
      order.status = status;
    }

    if (order.mode === null) {
      order.mode = mode;
    }

    order.save();
  }

  async updateOneOrderProduct(product: any, customerStripeId: string) {
    const order = await this.orderModel.findOne({
      customerStripeId: customerStripeId,
    });

    order.products.push(product);
    return await order.save();
  }

  async findOneOrder(customerStripeId: string) {
    return this.orderModel.findOne({ customerStripeId: customerStripeId });
  }
}
