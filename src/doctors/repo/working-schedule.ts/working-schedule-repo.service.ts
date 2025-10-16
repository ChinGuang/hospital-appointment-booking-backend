import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { WorkingSchedule } from '../../entities/working-schedule.entity';

@Injectable()
export class WorkingScheduleRepoService {
  constructor(
    @InjectRepository(WorkingSchedule)
    private readonly workingScheduleRepository: Repository<WorkingSchedule>,
  ) {}

  async deleteByDoctorId(
    doctorId: number,
    manager: EntityManager,
  ): Promise<void> {
    await manager.delete(WorkingSchedule, { doctorId });
  }

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
}
