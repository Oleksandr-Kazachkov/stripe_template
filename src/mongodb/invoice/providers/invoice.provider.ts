import { Connection } from 'mongoose';
import { InvoiceSchema } from '../shemas/invoice.shema';

export const invoiceProviders = [
  {
    provide: 'INVOICE_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Invoice', InvoiceSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
