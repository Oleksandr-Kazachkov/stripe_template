import { Module } from '@nestjs/common';
import { databaseProviders } from '../mongoose.provider';
import { InvoiceService } from './invoice.service';
import { invoiceProviders } from './providers/invoice.provider';

@Module({
  imports: [],
  controllers: [],
  providers: [...databaseProviders, ...invoiceProviders, InvoiceService],
})
export class InvoiceModule {}
