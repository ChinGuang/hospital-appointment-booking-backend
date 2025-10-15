import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { PermissionType } from '../enums/permission.enum';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: PermissionType, unique: true })
  type: PermissionType;
}
