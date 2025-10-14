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
    return this.permissionRepository.save({
      type: permissionType,
    });
  }
}
