import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { GetAppointmentSlotsReq } from '../../dto/get-appointment-slot.dto';
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

  async find(payload: GetAppointmentSlotsReq): Promise<AppointmentSlot[]> {
    const page = payload.page || 1;
    const limit = payload.limit || 10;
    const offset = (page - 1) * limit;
    const where = {};
    const whereDoctor = {};
    if (payload.doctorId) {
      whereDoctor['id'] = payload.doctorId;
    }
    if (payload.dayOfWeek) {
      where['dayOfWeek'] = payload.dayOfWeek;
    }
    if (payload.hospitalId) {
      whereDoctor['hospital'] = { id: payload.hospitalId };
    }
    if (Object.keys(whereDoctor).length > 0) {
      where['doctor'] = whereDoctor;
    }
    return await this.appointmentSlotRepository.find({
      where,
      take: limit,
      skip: offset,
    });
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
