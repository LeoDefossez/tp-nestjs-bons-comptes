import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { AuthenticatedRequest } from '../authenticated-request.js';

export const CurrentUser = createParamDecorator(
  (field: string | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request?.user;
    return field && user ? user[field as keyof typeof user] : user;
  },
);
