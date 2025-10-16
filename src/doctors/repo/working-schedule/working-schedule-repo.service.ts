import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Repository } from 'typeorm';
import { WorkingSchedule } from '../../entities/working-schedule.entity';

@Injectable()
export class WorkingScheduleRepoService {
  constructor(
    @InjectRepository(WorkingSchedule)
    private readonly workingScheduleRepository: Repository<WorkingSchedule>,
  ) {}

  async create(
    payload: Omit<WorkingSchedule, 'doctor' | 'id'>[],
    doctorId: number,
    manager: EntityManager,
  ): Promise<WorkingSchedule[]> {
    return await manager.save(
      WorkingSchedule,
      payload.map((p) => ({
        doctor: { id: doctorId },
        ...p,
      })),
    );
  }

  async findByDoctorId(doctorId: number): Promise<WorkingSchedule[]> {
    return await this.workingScheduleRepository.find({
      where: { doctor: { id: doctorId } },
    });
  }

  async findByDoctorIdWithinTransaction(
    doctorId: number,
    manager: EntityManager,
  ): Promise<WorkingSchedule[]> {
    return await manager.find(WorkingSchedule, {
      where: { doctor: { id: doctorId } },
    });
  }

  async findByDoctorIds(doctorIds: number[]): Promise<WorkingSchedule[]> {
    return await this.workingScheduleRepository.find({
      where: { doctor: { id: In(doctorIds) } },
    });
  }

  async deleteByDoctorId(doctorId: number): Promise<WorkingSchedule[]> {
    const workingSchedules = await this.findByDoctorId(doctorId);

    return await this.workingScheduleRepository.remove(workingSchedules);
  }

  async deleteByDoctorIdWithinTransaction(
    doctorId: number,
    manager: EntityManager,
  ): Promise<WorkingSchedule[]> {
    const workingSchedules = await this.findByDoctorIdWithinTransaction(
      doctorId,
      manager,
    );

    return await manager.remove(WorkingSchedule, workingSchedules);
  }
}
