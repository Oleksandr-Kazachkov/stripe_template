import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ versionKey: false })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ default: null })
  productId: string;

  @Prop({ default: null })
  unit_amount: number;

  @Prop({ default: null })
  currency: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
