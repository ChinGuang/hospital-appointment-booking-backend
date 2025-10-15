import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Hospital } from '../../hospitals/repo/entities/hospital.entity';
import { Role } from '../../role/entities/role.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Staff {
  @PrimaryColumn()
  userId: number;

  @OneToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;

  @ManyToOne(() => Hospital, { eager: true })
  hospital: Hospital;

  @ManyToOne(() => Role, { eager: true })
  role: Role;
}
