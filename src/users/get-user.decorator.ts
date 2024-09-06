import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './user.entity';

//Custom decorator to extract the currently authenticated user from the request object.
export const GetUser = createParamDecorator(
  (_data, context: ExecutionContext): User => {
    const req = context.switchToHttp().getRequest();
    return req.user;
  },
);
