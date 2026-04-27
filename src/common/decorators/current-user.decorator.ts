import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { JwTAuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<JwTAuthenticatedRequest>();
    return request.user;
  },
);
