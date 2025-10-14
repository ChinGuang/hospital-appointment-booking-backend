import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionType } from 'src/permissions/enums/permission.enum';
import { StaffService } from '../../../staff/staff.service';
import { UserType } from '../../../users/enums/user.enum';
import { AuthJwtService } from '../../services/auth-jwt/auth-jwt.service';
import { ErrorUtils } from '../../utils/errors';
import { BaseAuthGuard } from '../base-auth/base-auth.guard';
import { Permissions } from './permission.decorator';

export class PermissionGuard extends BaseAuthGuard implements CanActivate {
  constructor(
    private readonly staffService: StaffService,
    private reflector: Reflector,
    authJwtService: AuthJwtService,
  ) {
    super(authJwtService);
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: unknown = context.switchToHttp().getRequest();
    const permissionNeeded = this.reflector.get(
      Permissions,
      context.getHandler(),
    );
    const decodedUser = this.extractUserFromToken(request);
    if (decodedUser) {
      if ('userType' in decodedUser) {
        switch (decodedUser.userType) {
          case UserType.ADMIN:
            return true;
          case UserType.STAFF: {
            const userId =
              typeof decodedUser.userId === 'number'
                ? decodedUser.userId
                : parseInt(decodedUser.userId as string, 10);
            const staff = await this.staffService.getStaffByUserId(userId);
            if (staff) {
              const staffPermissions = staff.role.permissions.map(
                (p) => p.type,
              );
              if (
                staffPermissions.includes(PermissionType.ALL) ||
                permissionNeeded.every((p) => staffPermissions.includes(p))
              ) {
                return true;
              }
              throw new ForbiddenException(
                'Access denied: Insufficient permissions',
              );
            }
            break;
          }
          default:
            throw new ForbiddenException('Access denied: Staff or Admin only');
        }
      }
    }
    return ErrorUtils.unauthorizedTokenHandle();
  }
}
