import { Module } from '@nestjs/common';
import { HospitalController } from './hospital.controller';
import { HospitalService } from './hospital.service';
import { HospitalSmtpSettingRepoModule } from './repo/hospital-smtp-setting/hospital-smtp-setting-repo.module';
import { HospitalRepoModule } from './repo/hospital/hospital-repo.module';

@Module({
  imports: [HospitalRepoModule, HospitalSmtpSettingRepoModule],
  providers: [HospitalService],
  controllers: [HospitalController],
})
export class HospitalModule {}
