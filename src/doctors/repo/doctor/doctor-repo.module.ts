import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from '../../entities/doctor.entity';
import { DoctorRepoService } from './doctor-repo.service';

@Module({
  imports: [TypeOrmModule.forFeature([Doctor])],
  providers: [DoctorRepoService],
  exports: [DoctorRepoService],
})
export class DoctorRepoModule {}
