import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PermissionType } from '../permissions/enums/permission.enum';
import { PermissionRepoService } from '../permissions/permission-repo.service';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly permissionRepoService: PermissionRepoService,
  ) {}

  async getDefaultStaffRole() {
    const defaultName = 'Default Admin Staff';
    const defaultStaffRole = await this.roleRepository.findOne({
      where: {
        name: defaultName,
      },
    });

    if (!defaultStaffRole) {
      const permission = await this.permissionRepoService.getIfExistOrCreate(
        PermissionType.ALL,
      );
      return await this.roleRepository.save({
        name: defaultName,
        permissions: [permission],
      });
    }
    return defaultStaffRole;
  }
}
