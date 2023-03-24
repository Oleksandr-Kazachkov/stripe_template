import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import UserController from './user.controller';
import { usersProviders } from './providers/user.providers';
import { databaseProviders } from '../mongoose.provider';
import { ordersProviders } from '../order/providers/order.providers';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    UsersService,
    ...usersProviders,
    ...databaseProviders,
    ...ordersProviders,
  ],
})
export class UsersModule {}
