import { Module } from '@nestjs/common';
import { HospitalRepoModule } from '../hospitals/repo/hospital/hospital-repo.module';
import { DoctorController } from './doctor.controller';
import { DoctorService } from './doctor.service';
import { DoctorRepoModule } from './repo/doctor/doctor-repo.module';
import { LanguageRepoModule } from './repo/language/language-repo.module';
import { SpecializationRepoModule } from './repo/specialization/specialization-repo.module';

@Module({
  imports: [
    DoctorRepoModule,
    LanguageRepoModule,
    SpecializationRepoModule,
    HospitalRepoModule,
  ],
  providers: [DoctorService],
  controllers: [DoctorController],
  exports: [DoctorService],
})
export class DoctorModule {}
