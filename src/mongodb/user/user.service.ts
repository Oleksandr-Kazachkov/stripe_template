import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import createUserDto from './dto/createUser.dto';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_MODEL')
    private userModel: Model<User>,
  ) {}

  async create(createUserDto: createUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  updateOne(userId: number) {
    return this.userModel.updateOne({ _id: userId });
  }

  findOne(name: string) {
    return this.userModel.findOne({ name: name });
  }

  findOneById(customerStripeId: string) {
    return this.userModel.findOne({
      customerStripeId: customerStripeId,
    });
  }
}
