import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Language } from './language.entity';
import { Specialization } from './specialization.entity';

@Entity()
export class Doctor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column({ type: 'int' })
  experienceStartYear: number;

  @ManyToMany(() => Specialization)
  @JoinTable()
  specializations: Specialization[];

  @ManyToMany(() => Language)
  @JoinTable()
  spokenLangauges: Language[];
}
