import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InvoiceModule } from './mongodb/invoice/invoice.module';
import { DatabaseModule } from './mongodb/mongoose.module';
import { databaseProviders } from './mongodb/mongoose.provider';
import { OrderModule } from './mongodb/order/order.module';
import { ProductModule } from './mongodb/products/product.module';
import { UsersModule } from './mongodb/user/user.module';
import { StripeModule } from './stripe/stripe.module';

@Module({
  imports: [
    DatabaseModule,
    StripeModule,
    UsersModule,
    OrderModule,
    ProductModule,
    InvoiceModule,
  ],
  controllers: [AppController],
  providers: [AppService, ...databaseProviders],
})
export class AppModule {}
