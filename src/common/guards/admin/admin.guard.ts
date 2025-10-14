import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { UserType } from '../../../users/enums/user.enum';
import { ErrorUtils } from '../../utils/errors';
import { BaseAuthGuard } from '../base-auth/base-auth.guard';

@Injectable()
export class AdminGuard extends BaseAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: unknown = context.switchToHttp().getRequest();
    const decodedUser = this.extractUserFromToken(request);
    if (decodedUser) {
      if (
        'userType' in decodedUser &&
        decodedUser.userType === UserType.ADMIN
      ) {
        return true;
      } else {
        throw new ForbiddenException('Access denied: Admins only');
      }
    }
    return ErrorUtils.unauthorizedTokenHandle();
  }
}
