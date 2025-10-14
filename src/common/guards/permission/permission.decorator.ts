import { Reflector } from '@nestjs/core';
import { PermissionType } from 'src/staff/enums/permission.enum';

export const Permissions = Reflector.createDecorator<PermissionType[]>();
