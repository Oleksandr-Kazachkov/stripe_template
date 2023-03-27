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

@Controller()
export default class StripeController {
  constructor(
    private readonly stripeService: StripeService,
    private readonly userService: UsersService,
    private readonly orderService: OrderService,
    private readonly productService: ProductService,
    private readonly invoiceService: InvoiceService,
  ) {}

  @Post('/createPaymentLink')
  async create(@Body() paymentRequestBody: PaymentRequestBody) {
    return await this.stripeService.createPaymentLink(paymentRequestBody);
  }

  @Post('/paymentStatus')
  async paymentStatus(@Body() body: any) {
    let products = [];
    if (body.data.object.metadata.products) {
      products = JSON.parse(body.data.object.metadata.products);
    }

    const orderId = await this.orderService.findOneOrder(
      body.data.object.customer,
    );

    const user = await this.userService.findOneById(body.data.object.customer);

    const invoice = await this.invoiceService.createInvoice({
      data: body.data.object,
      customerId: user.customerId,
      orderId: orderId._id,
    });

    await this.orderService.updateOneOrder(
      body.data.object.customer,
      invoice,
      body.data.object.status,
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

  @Post('/createCustomer')
  async createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    const user = await this.userService.findOne(createCustomerDto.name);

    if (!user) {
      throw new BadRequestException('User was not found');
    }

    const customerId = await this.stripeService.createCustomer(
      createCustomerDto,
    );

    const objectId = new ObjectId(user._id);

    await this.orderService.createOrder({
      customerStripeId: customerId.id,
      customerId: objectId,
      products: [],
      invoce: [],
    });

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
}
