import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkingSchedule } from '../../entities/working-schedule.entity';
import { WorkingScheduleRepoService } from './working-schedule-repo.service';

@Module({
  imports: [TypeOrmModule.forFeature([WorkingSchedule])],
  providers: [WorkingScheduleRepoService],
  exports: [WorkingScheduleRepoService],
})
export class WorkingScheduleRepoModule {}
