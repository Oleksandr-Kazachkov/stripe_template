import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';
import createProductDto from './dto/create.product.dto';

@Injectable()
export class ProductService {
  constructor(
    @Inject('PRODUCT_MODEL')
    private productModel: Model<Product>,
  ) {}

  async createProduct(
    createProductDto: createProductDto,
    productId: string,
  ): Promise<Product> {
    const createdProduct = new this.productModel({
      name: createProductDto.name,
      unit_amount: createProductDto.unit_amount,
      currency: createProductDto.currency,
      productId,
    });
    return createdProduct.save();
  }
}
