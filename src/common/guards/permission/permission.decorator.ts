import { Reflector } from '@nestjs/core';
import { PermissionType } from 'src/permissions/enums/permission.enum';

export const Permissions = Reflector.createDecorator<PermissionType[]>();
