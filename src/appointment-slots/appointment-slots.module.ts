import { Module } from '@nestjs/common';
import { DoctorRepoModule } from '../doctors/repo/doctor/doctor-repo.module';
import { AppointmentSlotController } from './appointment-slots.controller';
import { AppointmentSlotsService } from './appointment-slots.service';
import { AppointmentSlotRepoModule } from './repo/appointment-slots/appointment-slots-repo.module';

@Module({
  imports: [AppointmentSlotRepoModule, DoctorRepoModule],
  providers: [AppointmentSlotsService],
  controllers: [AppointmentSlotController],
  exports: [AppointmentSlotsService],
})
export class AppointmentSlotModule {}
