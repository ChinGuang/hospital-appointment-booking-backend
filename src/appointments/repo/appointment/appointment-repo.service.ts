import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, LessThan, MoreThan, Not, Repository } from 'typeorm';
import { Appointment } from '../../entities/appointment.entity';
import { AppointmentStatus } from '../../enums/appointment-status.enum';

@Injectable()
export class AppointmentRepoService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

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
    return this.appointmentRepository.find({ where, take, skip });
  }
}
