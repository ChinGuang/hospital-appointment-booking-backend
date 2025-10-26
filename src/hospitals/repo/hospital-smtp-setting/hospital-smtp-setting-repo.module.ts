import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HospitalSmtpSetting } from '../entities/hospital.entity';
import { HospitalSmtpSettingRepoService } from './hospital-smtp-setting-repo.service';

@Module({
  imports: [TypeOrmModule.forFeature([HospitalSmtpSetting]), ConfigModule],
  providers: [HospitalSmtpSettingRepoService],
  exports: [HospitalSmtpSettingRepoService],
})
export class HospitalSmtpSettingRepoModule {}
