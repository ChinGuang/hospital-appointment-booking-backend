import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  FindOptionsWhere,
  LessThan,
  MoreThan,
  Not,
  Repository,
} from 'typeorm';
import { Appointment } from '../../entities/appointment.entity';
import { AppointmentStatus } from '../../enums/appointment-status.enum';

@Injectable()
export class AppointmentRepoService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  async createWithAvailabilityCheck(
    appointment: Omit<Appointment, 'id' | 'createdAt'>,
    dataSource: DataSource,
  ): Promise<Appointment> {
    return dataSource.transaction(async (manager) => {
      const conflict = await manager.getRepository(Appointment).findOne({
        where: {
          doctor: { id: appointment.doctor.id },
          appointmentDate: appointment.appointmentDate,
          startTime: LessThan(appointment.endTime),
          endTime: MoreThan(appointment.startTime),
          appointmentStatus: Not(AppointmentStatus.CANCELLED),
        },
        lock: { mode: 'pessimistic_write' },
      });
      if (conflict) {
        throw new ConflictException('Time slot is not available');
      }
      return manager.getRepository(Appointment).save(appointment);
    });
  }

  async create(
    appointment: Omit<Appointment, 'id' | 'createdAt'>,
  ): Promise<Appointment> {
    return this.appointmentRepository.save(appointment);
  }

  async validateAvailableTimeSlot(
    doctorId: number,
    appointmentDate: Date,
    startTime: string,
    endTime: string,
  ): Promise<boolean> {
    const overlappingAppointment = await this.appointmentRepository.findOne({
      where: {
        doctor: { id: doctorId },
        appointmentDate,
        startTime: LessThan(endTime),
        endTime: MoreThan(startTime),
        appointmentStatus: Not(AppointmentStatus.CANCELLED),
      },
    });
    return overlappingAppointment === null;
  }

  async findAppointments(
    where: FindOptionsWhere<Appointment>,
    take: number,
    skip: number,
  ): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      where,
      take,
      skip,
      relations: ['doctor', 'patient'],
    });
  }

  async cancelAppointment(
    appointmentId: number,
    from: {
      patientId?: number;
      hospitalId?: number;
    },
  ): Promise<Appointment> {
    if (!from.patientId && !from.hospitalId) {
      throw new ForbiddenException('Access denied: Patient or hospital only');
    }
    const appointment = await this.appointmentRepository.findOne({
      where: { id: appointmentId },
      relations: ['doctor', 'patient'],
    });
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }
    if (from.patientId && appointment.patient.id !== from.patientId) {
      throw new ForbiddenException('Access denied: Patient only');
    }
    if (from.hospitalId && appointment.doctor.hospital.id !== from.hospitalId) {
      throw new ForbiddenException('Access denied: Hospital only');
    }
    if (appointment.appointmentStatus === AppointmentStatus.CANCELLED) {
      return appointment;
    }
    appointment.appointmentStatus = AppointmentStatus.CANCELLED;
    return this.appointmentRepository.save(appointment);
  }
}
