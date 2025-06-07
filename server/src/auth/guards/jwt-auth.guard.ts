import { JwtService } from '@nestjs/jwt';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from '../constants';

@Injectable()
export class AuthGuard implements CanActivate {
   constructor(private jwtService: JwtService) {}

   async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest();

      const token = this.extractTokenFromHeader(request);

      if (!token) {
         throw new UnauthorizedException();
      }

      console.log('token', token);
      console.log('secret', jwtConstants.secret);
      

      try {
         console.log('chạy vào đây 1');

         const payload = await this.jwtService.verifyAsync(token, {
            secret: jwtConstants.secret,
         });
         console.log('payload:', payload);

         request['user'] = payload;
      } catch (error) {
         console.error('⚠️ JWT Verify Error:', error.name, error.message);
         throw new UnauthorizedException('loi 111');
      }

      return true;
   }

   private extractTokenFromHeader(request: Request): string | undefined {
      const authorizationHeader = request.headers['authorization'];

      if (!authorizationHeader) {
         return undefined;
      }

      const [type, token] = authorizationHeader.split(' ');

      if (type != 'Bearer' && !token) {
         return undefined;
      }

      return token;
   }
}
