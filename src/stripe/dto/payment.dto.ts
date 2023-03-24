import { Product } from './product.dto';

export interface PaymentRequestBody {
  products: Product[];

  currency: string;

  customerId: string;
}
