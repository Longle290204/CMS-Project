import { Post, Patch, Body, Get, Query, Param, Delete, Controller } from '@nestjs/common';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Public()
@Controller('user')
export class UserController {
   constructor(private readonly userService: UserService) {}

   @Get('profile')
   async getProfile(@GetUser() user: User): Promise<User> {
      return this.userService.getById(user);
   }

   // Admin find list users
   @Get()
   async getAllUser() {
      return this.userService.getAll();
   }

   // Admin create user
   @Post()
   creatUser(@Body() dto: CreateUserDto) {
      this.userService.createUser(dto);
   }

   // Admin update user
   @Patch(':id')
   async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<any> {
      return this.userService.updateUser(id, updateUserDto);
   }

   //Admin delete user
   @Delete(':id')
   async deleteUser(@Param('id') id: string): Promise<string> {
      return this.userService.deleteUser(id);
   }

   @Get('filter')
   async getFilterUser(@Query('search') search: string): Promise<User[]> {
      return this.userService.getFilterUser(search);
   }

   @Post('/logout')
   logout(@GetUser() user: User) {
      const id = user.id;
      return this.userService.logOut(id);
   }

   @Patch('/changePassword')
   changePassword(@GetUser() user: User, @Body() updatePasswordDto: UpdatePasswordDto) {
      const id = user.id;
      return this.userService.changePassword(id, updatePasswordDto);
   }
}
