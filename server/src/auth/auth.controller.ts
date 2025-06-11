import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthSignUpDto, AuthSignInDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './guards/jwt-auth.guard';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { Public } from './decorators/public.decorator';

@Public()
@Controller('auth')
export class AuthController {
   constructor(private readonly authService: AuthService) {}

   @Post('sign-up')
   async signUp(@Body() authSignUpDto: AuthSignUpDto): Promise<string> {
      await this.authService.signUp(authSignUpDto);
      return 'Sign up succesfully';
   }

   @Post('sign-in')
   signIn(@Body() authSignInDto: AuthSignInDto): Promise<{ accessToken: string; refreshToken: string }> {
      return this.authService.signIn(authSignInDto);
   }

   @UseGuards(AuthGuard)
   @Get('profile')
   getProfile(@GetUser() user: User) {
      return user;
   }
}
