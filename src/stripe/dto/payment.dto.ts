import { Product } from './product.dto';

type Mode = 'payment' | 'setup' | 'subscription';
export interface PaymentRequestBody {
  products: Product[];

  currency: string;

  customerId: string;

  mode: Mode;
}
