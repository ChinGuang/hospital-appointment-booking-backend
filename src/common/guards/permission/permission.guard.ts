import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { UserType } from 'src/users/enums/user.enum';
import { AuthJwtService } from '../../services/auth-jwt/auth-jwt.service';
import { ErrorUtils } from '../../utils/errors';
import { BaseAuthGuard } from '../base-auth/base-auth.guard';

export class PermissionGuard extends BaseAuthGuard implements CanActivate {
  constructor(
    //staffService
    authJwtService: AuthJwtService,
  ) {
    super(authJwtService);
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: unknown = context.switchToHttp().getRequest();
    const decodedUser = this.extractUserFromToken(request);
    if (decodedUser) {
      if ('userType' in decodedUser) {
        switch (decodedUser.userType) {
          case UserType.ADMIN:
            return true;
          case UserType.STAFF:
            const staff = await this.userService.getUser();
            break;
          default:
            throw new ForbiddenException('Access denied: Staff or Admin only');
        }
      }
    }
    return ErrorUtils.unauthorizedTokenHandle();
  }
}
