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

  async getDefaultStaffRole(): Promise<Role> {
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
      try {
        return await this.roleRepository.save({
          name: defaultName,
          permissions: [permission],
        });
      } catch {
        // Handle unique violation -> fetch the just-created role
        return (await this.roleRepository.findOne({
          where: { name: defaultName },
        }))!;
      }
    }
    return defaultStaffRole;
  }

  async getRoleById(id: number): Promise<Role | null> {
    return this.roleRepository.findOne({
      where: {
        id,
      },
    });
  }
}
