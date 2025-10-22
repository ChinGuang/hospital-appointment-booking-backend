import { Module } from '@nestjs/common';
import { AppointmentPatientController } from './appointment-patient.controller';
import { AppointmentStaffController } from './appointment-staff.controller';
import { AppointmentService } from './appointment.service';
import { AppointmentRepoModule } from './repo/appointment/appointment-repo.module';

@Module({
  imports: [AppointmentRepoModule],
  controllers: [AppointmentStaffController, AppointmentPatientController],
  providers: [AppointmentService],
  exports: [AppointmentService],
})
export class AppointmentModule {}
