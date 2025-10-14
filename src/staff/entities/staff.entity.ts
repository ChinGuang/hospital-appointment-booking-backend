import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './role.entity';

@Entity()
export class Staff {
  @PrimaryGeneratedColumn()
  userId: number;

  @ManyToOne(() => Role, { eager: true })
  role: Role;
}
