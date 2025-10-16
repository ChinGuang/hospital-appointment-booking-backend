import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { DoctorRepoService } from '../doctors/repo/doctor/doctor-repo.service';
import {
  GetAppointmentSlotsReq,
  GetAppointmentSlotsRes,
  GetDoctorAppointmentSlotsRes,
} from './dto/get-appointment-slot.dto';
import {
  UpdateAppointmentSlotReq,
  UpdateAppointmentSlotRes,
} from './dto/update-appointment-slot.dto';
import { AppointmentSlotsRepoService } from './repo/appointment-slots/appointment-slots-repo.service';

@Injectable()
export class AppointmentSlotsService {
  constructor(
    private readonly appointmentSlotRepoService: AppointmentSlotsRepoService,
    private readonly doctorRepoService: DoctorRepoService,
    private readonly dataSource: DataSource,
  ) {}

  async readDoctorAppointmentSlots(
    doctorId: number,
  ): Promise<GetDoctorAppointmentSlotsRes> {
    const slots =
      await this.appointmentSlotRepoService.findByDoctorId(doctorId);
    return {
      message: 'Appointment slots retrieved successfully',
      data: slots,
    };
  }

  async readAppointmentSlots(
    payload: GetAppointmentSlotsReq,
  ): Promise<GetAppointmentSlotsRes> {
    const slots = await this.appointmentSlotRepoService.find(payload);
    return {
      message: 'Appointment slots retrieved successfully',
      data: slots,
    };
  }

  async updateDoctorAppointmentSlots(
    doctorId: number,
    requestHospitalId: number,
    payload: UpdateAppointmentSlotReq,
  ): Promise<UpdateAppointmentSlotRes> {
    const doctor = await this.doctorRepoService.findById(doctorId);
    if (!doctor || doctor.hospital.id !== requestHospitalId) {
      throw new Error('Doctor not found');
    }
    const appointmentSlots = await this.dataSource.transaction(
      async (manager) => {
        await this.appointmentSlotRepoService.deleteByDoctorIdWithinTransaction(
          doctorId,
          manager,
        );
        return await this.appointmentSlotRepoService.createWithinTransaction(
          payload.appointmentSlots,
          doctorId,
          manager,
        );
      },
    );
    return {
      message: 'Appointment slots updated successfully',
      data: appointmentSlots,
    };
  }
}
