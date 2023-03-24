import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './user.service';

@Controller()
export default class UserController {
  constructor(private readonly userService: UsersService) {}

  @Post('/createUser')
  async createUser(@Body() createUserDto) {
    const user = await this.userService.create(createUserDto);

    return {
      name: user.name,
      email: user.email,
      password: user.password,
    };
  }
}
