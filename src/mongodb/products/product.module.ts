import { Module } from '@nestjs/common';
import { databaseProviders } from '../mongoose.provider';
import { productsProviders } from './providers/product.provider';
import { ProductService } from './product.service';

@Module({
  imports: [],
  controllers: [],
  providers: [...databaseProviders, ...productsProviders, ProductService],
})
export class ProductModule {}
