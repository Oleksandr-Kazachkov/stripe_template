import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import StripeService from './stripe.service';
import { PaymentRequestBody } from './dto/payment.dto';
import CreateCustomerDto from './dto/create.customer.dto';
import { UsersService } from 'src/mongodb/user/user.service';
import { OrderService } from 'src/mongodb/order/order.service';
import { ProductService } from 'src/mongodb/products/product.service';
import CreateProductDto from 'src/mongodb/products/dto/create.product.dto';
import { InvoiceService } from 'src/mongodb/invoice/invoice.service';
import { ObjectId } from 'mongodb';
import { UpdateSubscriptionDto } from './dto/update.subscription.dto';
import { SubscriptionService } from 'src/mongodb/subscription/subscription.service';

@Controller()
export default class StripeController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly userService: UsersService,
    private readonly orderService: OrderService,
    private readonly productService: ProductService,
    private readonly invoiceService: InvoiceService,
    private readonly subscriptionService: SubscriptionService,
  ) {}

  @Post('/createPaymentLink')
  async create(@Body() paymentRequestBody: PaymentRequestBody) {
    const user = await this.userService.findOneById(
      paymentRequestBody.customerId,
    );

    const objectId = new ObjectId(user._id);

    if (paymentRequestBody.mode === 'payment') {
      await this.orderService.createOrder({
        customerStripeId: paymentRequestBody.customerId,
        userId: objectId,
        products: [],
        invoce: [],
        mode: null,
      });
    }

    if (paymentRequestBody.mode === 'subscription') {
      await this.subscriptionService.createSubscription({
        subscriptionId: '',
        collection_method: '',
        userId: objectId,
        plan: {},
        dateOfCreating: Date.now(),
        invoiceId: [],
        customerStripeId: paymentRequestBody.customerId,
      });
    }

    return await this.stripeService.createPaymentLink(paymentRequestBody);
  }

  @Post('/paymentStatus')
  async paymentStatus(@Body() body: any) {
    if (!body.data.object.subscription) {
      let invoice;
      let products = [];
      if (body.data.object.metadata.products) {
        products = JSON.parse(body.data.object.metadata.products);
      }

      const orderId = await this.orderService.findOneOrder(
        body.data.object.customer,
      );

      const user = await this.userService.findOneById(
        body.data.object.customer,
      );

      if (body.type != 'checkout.session.completed') {
        invoice = await this.invoiceService.createInvoice({
          data: body.data.object,
          userId: user._id,
          orderId: orderId._id,
          status: body.type,
        });
      }

      await this.orderService.updateOneOrder(
        body.data.object.customer,
        invoice,
        body.data.object.status,
        body.data.object.metadata.mode,
      );
      await Promise.all(
        products.map(async (el) => {
          await this.orderService.updateOneOrderProduct(
            el,
            body.data.object.customer,
          );
        }),
      );

      return body;
    }
  }

  @Post('/subscriptionStatus')
  async subsriptionStatus(@Body() body: any) {
    let invoice;

    const subscription = await this.subscriptionService.findOneByCustomerId(
      body.data.object.customer,
    );

    const user = await this.userService.findOneById(body.data.object.customer);

    if (body.type != 'checkout.session.completed') {
      invoice = await this.invoiceService.createInvoice({
        subscriptionId: subscription._id,
        data: body.data.object,
        userId: user._id,
        status: body.type,
      });
    }

    await this.subscriptionService.updateSubscription(
      subscription,
      body.data.object.status,
      invoice._id,
      body.data.object.id,
      body.data.object.collection_method,
      body.data.object.plan,
    );

    return body;
  }

  @Post('/createCustomer')
  async createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    const user = await this.userService.findOne(createCustomerDto.name);

    if (!user) {
      throw new BadRequestException('User was not found');
    }

    const objectId = new ObjectId(user._id);

    const customerId = await this.stripeService.createCustomer(
      createCustomerDto,
    );

    await user.updateOne({
      customerId: objectId,
      customerStripeId: customerId.id,
    });

    user.save();

    return { customerStripeId: customerId.id };
  }

  @Post('/createProduct')
  async createProduct(@Body() createProductDto: CreateProductDto) {
    const productId = await this.stripeService.createProduct(
      createProductDto.name,
    );

    if (!productId) {
      throw new BadRequestException('Bad request');
    }

    const product = await this.stripeService.createPrice(
      createProductDto,
      productId.id,
    );

    if (!product) {
      throw new BadRequestException('Bad request');
    }

    await this.productService.createProduct(createProductDto, product.id);

    return product;
  }

  @Post('/stopSubscription')
  async updateSubscription(
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    return await this.stripeService.updateSubscription(updateSubscriptionDto);
  }

  @Post('/deleteSubscription')
  async deleteSubscription(@Body() subscriptionId: any) {
    return await this.stripeService.cancelSubscription(
      subscriptionId.subscriptionId,
    );
  }

  @Post('/resumeSubscription')
  async resumeSubscripttion(@Body() subscriptionId: any) {
    return await this.stripeService.resumeSubscription(
      subscriptionId.subscriptionId,
    );
  }
}
