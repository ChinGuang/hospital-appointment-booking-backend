import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserType } from '../enums/user.enum';

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
