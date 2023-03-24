import { BadRequestException, Injectable } from '@nestjs/common';
import createProductDto from 'src/mongodb/products/dto/create.product.dto';
import Stripe from 'stripe';
import CreateCustomerDto from './dto/create.customer.dto';
import { PaymentRequestBody } from './dto/payment.dto';

@Injectable()
export default class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(
      'sk_test_51MnjqHHBtQv1vxW0gvQvqB5dW26wS69ivEqTh44fLF6PiVKZOP8a6EKYXXuzY04iJIPlIpkJ1kKt5ZmbdvBXcHJD00OGf7VffW',
      {
        apiVersion: '2022-11-15',
      },
    );
  }

  public async createCustomer(createCustomerDto: CreateCustomerDto) {
    return this.stripe.customers.create({
      name: createCustomerDto.name,
      email: createCustomerDto.email,
    });
  }

  async getCost(param: string) {
    return (await this.stripe.prices.retrieve(param)).unit_amount;
  }

  async createPaymentLink(paymentRequestBody: PaymentRequestBody) {
    if (!paymentRequestBody.customerId) {
      throw new BadRequestException('Firstly create customer');
    }

    const line_items = paymentRequestBody.products.map((element) => {
      return {
        price: element.price,
        quantity: element.quantity,
      };
    });
    const metaLineItems = await Promise.all(
      line_items.map(async (el) => {
        return {
          price: await this.getCost(el.price),
          quantity: el.quantity,
        };
      }),
    );

    const payment_link = await this.stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      currency: 'uah',
      customer: paymentRequestBody.customerId,
      success_url: 'https://dashboard.stripe.com/test/payments',
      metadata: { ['products']: JSON.stringify(metaLineItems) },
    });

    return payment_link.url;
  }

  async createProduct(name: string) {
    return await this.stripe.products.create({ name: name });
  }

  async createPrice(createProductDto: createProductDto, productId: string) {
    const resp = {
      product: productId,
      unit_amount: createProductDto.unit_amount,
      currency: createProductDto.currency,
    };

    return await this.stripe.prices.create(resp);
  }
}
