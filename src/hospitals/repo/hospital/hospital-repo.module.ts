import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address, Hospital } from '../entities/hospital.entity';
import { HospitalRepoService } from './hospital-repo.service';

@Module({
  imports: [TypeOrmModule.forFeature([Hospital, Address])],
  providers: [HospitalRepoService],
  exports: [HospitalRepoService],
})
export class HospitalRepoModule {}
