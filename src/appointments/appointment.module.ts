import { Module } from '@nestjs/common';
import { EmailModule } from '../common/services/email/email.module';
import { DoctorRepoModule } from '../doctors/repo/doctor/doctor-repo.module';
import { UserModule } from '../users/user.module';
import { AppointmentPatientController } from './appointment-patient.controller';
import { AppointmentStaffController } from './appointment-staff.controller';
import { AppointmentService } from './appointment.service';
import { AppointmentRepoModule } from './repo/appointment/appointment-repo.module';

@Module({
  imports: [AppointmentRepoModule, UserModule, DoctorRepoModule, EmailModule],
  controllers: [AppointmentPatientController, AppointmentStaffController],
  providers: [AppointmentService],
  exports: [AppointmentService],
})
export class AppointmentModule {}
