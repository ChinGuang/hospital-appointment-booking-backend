import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hospital } from '../entities/hospital.entity';
import { HospitalRepoService } from './hospital-repo.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Hospital]), // Add your entities here
  ],
  providers: [HospitalRepoService],
  exports: [HospitalRepoService],
})
export class HospitalRepoModule {}
