import { Body, Controller, Post, Get } from '@nestjs/common';
import { UserClickService } from './user_click.service';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/user/entities/user.entity';
import { UserClick } from './entities/user_click.entity';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('user-click')
export class UserClickController {
   constructor(private userClickService: UserClickService) {}

   @Post()
   handleClick(@GetUser() user: User, @Body('id') articleId: string) {
      const userId = user.id;
      this.userClickService.handleClick(userId, articleId);
   }

   @Public()
   @Get()
   async getAll(): Promise<UserClick[]> {
      return this.userClickService.getAll();
   }
}
