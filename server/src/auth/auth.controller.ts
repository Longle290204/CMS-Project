import { Body, Controller, Post } from '@nestjs/common';
import { AuthSignUpDto, AuthSignInDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
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
}
