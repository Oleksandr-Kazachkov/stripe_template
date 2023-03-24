import { Module } from '@nestjs/common';
import { databaseProviders } from '../mongoose.provider';
import { ordersProviders } from './providers/order.providers';
import { OrderService } from './order.service';

@Module({
  imports: [],
  controllers: [],
  providers: [...databaseProviders, ...ordersProviders, OrderService],
})
export class OrderModule {}
