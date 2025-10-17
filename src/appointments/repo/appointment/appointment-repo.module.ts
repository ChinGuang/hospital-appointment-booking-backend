import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from '../../entities/appointment.entity';
import { AppointmentRepoService } from './appointment-repo.service';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment])],
  providers: [AppointmentRepoService],
  exports: [AppointmentRepoService],
})
export class AppointmentRepoModule {}
