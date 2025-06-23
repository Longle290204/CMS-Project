import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../role/roles.decorator';
import { Role } from '../role/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
   constructor(private reflector: Reflector) {}
   async canActivate(context: ExecutionContext): Promise<boolean> {
      const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
         context.getHandler(),
         context.getClass(),
      ]);
      console.log('requiredRoles', requiredRoles);
      if (!requiredRoles) {
         return true;
      }
      const { user } = context.switchToHttp().getRequest();

      console.log('user need find', user);

      const check = requiredRoles.some((role) => user.roles?.includes(role));
      if (check) {
         return true;
      }
      throw new UnauthorizedException(`you are not access this role`);
   }
}
