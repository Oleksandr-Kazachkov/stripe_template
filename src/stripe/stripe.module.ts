import { Module } from '@nestjs/common';
import StripeService from './stripe.service';
import StripeController from './stripe.controller';
import { UsersService } from 'src/mongodb/user/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { usersProviders } from 'src/mongodb/user/providers/user.providers';
import { databaseProviders } from 'src/mongodb/mongoose.provider';
import { ordersProviders } from 'src/mongodb/order/providers/order.providers';
import { OrderService } from 'src/mongodb/order/order.service';
import { ProductService } from 'src/mongodb/products/product.service';
import { productsProviders } from 'src/mongodb/products/providers/product.provider';
import { InvoiceService } from 'src/mongodb/invoice/invoice.service';
import { invoiceProviders } from 'src/mongodb/invoice/providers/invoice.provider';

@Module({
  imports: [MongooseModule],
  controllers: [StripeController],
  providers: [
    StripeService,
    UsersService,
    OrderService,
    ProductService,
    InvoiceService,
    ...usersProviders,
    ...databaseProviders,
    ...ordersProviders,
    ...productsProviders,
    ...invoiceProviders,
  ],
})
export class StripeModule {}
