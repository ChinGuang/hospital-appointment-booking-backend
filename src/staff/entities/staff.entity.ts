import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Hospital } from '../../hospitals/repo/entities/hospital.entity';
import { Role } from '../../role/entities/role.entity';

@Entity()
export class Staff {
  @PrimaryGeneratedColumn()
  userId: number;

  @ManyToOne(() => Hospital, { eager: true })
  hospital: Hospital;

  @ManyToOne(() => Role, { eager: true })
  role: Role;
}
