import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserType } from '../enums/user.enum';
import { Role } from './role.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserType })
  userType: UserType;
}

@Entity()
export class Staff {
  @PrimaryGeneratedColumn()
  userId: number;

  @ManyToOne(() => Role, { eager: true })
  role: Role;
}
