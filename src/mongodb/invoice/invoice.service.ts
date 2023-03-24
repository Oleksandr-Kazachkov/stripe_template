import { Inject, Injectable } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import createInvoiceDto from './dto/create.invoice.dto';
import { Invoice } from './shemas/invoice.shema';

@Injectable()
export class InvoiceService {
  constructor(
    @Inject('INVOICE_MODEL')
    private invoiceModel: Model<Invoice>,
  ) {}

  async createInvoice(createInvoiceDto: createInvoiceDto): Promise<ObjectId> {
    const createdInvoice = new this.invoiceModel(createInvoiceDto);
    const invoice = await createdInvoice.save();
    return invoice._id;
  }
}
