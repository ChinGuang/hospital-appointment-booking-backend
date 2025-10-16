import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentSlot } from '../../entities/appointment-slot.entity';
import { AppointmentSlotsRepoService } from './appointment-slots-repo.service';

@Module({
  imports: [TypeOrmModule.forFeature([AppointmentSlot])],
  providers: [AppointmentSlotsRepoService],
  exports: [AppointmentSlotsRepoService],
})
export class AppointmentSlotRepoModule {}
