import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Doctor } from '../../doctors/entities/doctor.entity';
import { User } from '../../users/entities/user.entity';
import { AppointmentStatus } from '../enums/appointment-status.enum';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Doctor, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'doctorId', referencedColumnName: 'id' })
  doctor: Doctor;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patientId', referencedColumnName: 'id' })
  patient: User;

  @Column({ type: 'date' })
  appointmentDate: Date;

  @Column({ type: 'enum', enum: AppointmentStatus })
  appointmentStatus: AppointmentStatus;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  cancelAt?: Date;
}
