import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { AppointmentSlot } from '../../entities/appointment-slot.entity';

@Injectable()
export class AppointmentSlotsRepoService {
  constructor(
    @InjectRepository(AppointmentSlot)
    private readonly appointmentSlotRepository: Repository<AppointmentSlot>,
  ) {}

  async createWithinTransaction(
    payload: Omit<AppointmentSlot, 'doctor' | 'id'>[],
    doctorId: number,
    manager: EntityManager,
  ): Promise<AppointmentSlot[]> {
    return await manager.save(
      AppointmentSlot,
      payload.map((p) => ({
        doctor: { id: doctorId },
        ...p,
      })),
    );
  }

  async findByDoctorId(doctorId: number): Promise<AppointmentSlot[]> {
    return await this.appointmentSlotRepository.find({
      where: { doctor: { id: doctorId } },
    });
  }

  async findByDoctorIdWithinTransaction(
    doctorId: number,
    manager: EntityManager,
  ): Promise<AppointmentSlot[]> {
    return await manager.find(AppointmentSlot, {
      where: { doctor: { id: doctorId } },
    });
  }

  async deleteByDoctorIdWithinTransaction(
    doctorId: number,
    manager: EntityManager,
  ): Promise<AppointmentSlot[]> {
    const appointmentSlots = await this.findByDoctorIdWithinTransaction(
      doctorId,
      manager,
    );
    return await manager.remove(AppointmentSlot, appointmentSlots);
  }
}
