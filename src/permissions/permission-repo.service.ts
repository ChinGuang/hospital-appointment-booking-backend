import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { PermissionType } from './enums/permission.enum';

@Injectable()
export class PermissionRepoService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}
  async getIfExistOrCreate(
    permissionType: PermissionType,
  ): Promise<Permission> {
    const permission = await this.permissionRepository.findOneBy({
      type: permissionType,
    });
    if (permission) {
      return permission;
    }
    try {
      return await this.permissionRepository.save({
        type: permissionType,
      });
    } catch (error) {
      // If duplicate key error (e.g., unique constraint violation),
      // retry the lookup as another concurrent request may have created it
      const retryPermission = await this.permissionRepository.findOneBy({
        type: permissionType,
      });
      if (retryPermission) {
        return retryPermission;
      }
      throw error;
    }
  }
}
