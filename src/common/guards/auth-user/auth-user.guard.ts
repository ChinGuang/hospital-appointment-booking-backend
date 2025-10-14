import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ErrorUtils } from '../../utils/errors';
import { BaseAuthGuard } from '../base-auth/base-auth.guard';

@Injectable()
export class AuthUserGuard extends BaseAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: unknown = context.switchToHttp().getRequest();
    const decodedUser = this.extractUserFromToken(request);
    if (decodedUser) {
      if (request && typeof request === 'object') {
        request['user'] = decodedUser;
      }
      return true;
    }
    return ErrorUtils.unauthorizedTokenHandle();
  }
}
