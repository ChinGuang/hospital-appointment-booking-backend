import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Hospital } from '../../hospitals/repo/entities/hospital.entity';
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

  @ManyToMany(() => Specialization, { cascade: true })
  @JoinTable()
  specializations: Specialization[];

  @ManyToMany(() => Language, { cascade: true })
  @JoinTable()
  spokenLangauges: Language[];

  @ManyToOne(() => Hospital, { eager: true })
  hospital: Hospital;
}
