import { Body, Controller, ExecutionContext, Get, HttpCode, HttpStatus, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthSignUpDto, AuthSignInDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { Public } from './decorators/public.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

// @Public()
@Controller('auth')
export class AuthController {
   constructor(private readonly authService: AuthService) {}

   @Post('sign-up')
   @Public()
   async signUp(@Body() authSignUpDto: AuthSignUpDto): Promise<string> {
      await this.authService.signUp(authSignUpDto);
      return 'Sign up succesfully';
   }

   @Post('sign-in')
   @Public()
   signIn(@Body() authSignInDto: AuthSignInDto): Promise<{ accessToken: string; refreshToken: string }> {
      return this.authService.signIn(authSignInDto);
   }

   @Post('/logout')
   logout(@GetUser() user: User) {
      const id = user.id;
      return this.authService.logOut(id);
   }

   @Patch('/changePassword')
   changePassword(@GetUser() user: User, @Body() updateUserDto: UpdateUserDto) {
      const id = user.id;
      return this.authService.changePassword(id, updateUserDto);
   }

   @Get('profile')
   // @Public()
   getProfile(@GetUser() user: User) {
      return user;
   }
}
