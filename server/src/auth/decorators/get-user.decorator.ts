import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { createParamDecorator } from '@nestjs/common';
import { User } from '../entities/user.entity';

export const GetUser = createParamDecorator((_data, context: ExecutionContextHost): User => {
   const req = context.switchToHttp().getRequest();
   return req.user;
});
