import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DoctorRepoService } from '../doctors/repo/doctor/doctor-repo.service';
import { UserService } from '../users/user.service';
import {
  CreateAppointmentPatientReq,
  CreateAppointmentPatientRes,
  CreateAppointmentStaffReq,
  CreateAppointmentStaffRes,
} from './dto/create-appointment.dto';
import { AppointmentStatus } from './enums/appointment-status.enum';
import { AppointmentRepoService } from './repo/appointment/appointment-repo.service';

@Injectable()
export class AppointmentService {
  constructor(
    private readonly appointmentRepoService: AppointmentRepoService,
    private readonly userService: UserService,
    private readonly doctorRepoService: DoctorRepoService,
  ) {}

  async createAppointmentFromStaff(
    createAppointmentStaffReq: CreateAppointmentStaffReq,
  ): Promise<CreateAppointmentStaffRes> {
    const patient = await this.userService.getUserById(
      createAppointmentStaffReq.patientId,
    );
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    const doctor = await this.doctorRepoService.findById(
      createAppointmentStaffReq.doctorId,
    );
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }
    const appointmentDate = new Date(createAppointmentStaffReq.appointmentDate);
    const isAvailable =
      await this.appointmentRepoService.validateAvailableTimeSlot(
        doctor.id,
        appointmentDate,
        createAppointmentStaffReq.startTime,
        createAppointmentStaffReq.endTime,
      );
    if (!isAvailable) {
      throw new ConflictException('Time slot is not available');
    }
    const appointment = await this.appointmentRepoService.create({
      appointmentDate,
      startTime: createAppointmentStaffReq.startTime,
      endTime: createAppointmentStaffReq.endTime,
      doctor,
      patient,
      appointmentStatus: AppointmentStatus.SCHEDULED,
    });
    return {
      message: 'Appointment created successfully',
      data: {
        id: appointment.id,
        patientId: appointment.patient.id,
        doctorId: appointment.doctor.id,
        appointmentDate: appointment.appointmentDate.toISOString(),
        startTime: appointment.startTime,
        endTime: appointment.endTime,
      },
    };
  }

  async createAppointmentFromPatient(
    payload: CreateAppointmentPatientReq,
    patientId: number,
  ): Promise<CreateAppointmentPatientRes> {
    const doctor = await this.doctorRepoService.findById(payload.doctorId);
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }
    const patient = await this.userService.getUserById(patientId);
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    const appointmentDate = new Date(payload.appointmentDate);
    const isAvailable =
      await this.appointmentRepoService.validateAvailableTimeSlot(
        doctor.id,
        appointmentDate,
        payload.startTime,
        payload.endTime,
      );
    if (!isAvailable) {
      throw new ConflictException('Time slot is not available');
    }
    const appointment = await this.appointmentRepoService.create({
      appointmentDate,
      startTime: payload.startTime,
      endTime: payload.endTime,
      doctor,
      patient,
      appointmentStatus: AppointmentStatus.SCHEDULED,
    });
    return {
      message: 'Appointment created successfully',
      data: {
        id: appointment.id,
        patientId: appointment.patient.id,
        doctorId: appointment.doctor.id,
        appointmentDate: appointment.appointmentDate.toISOString(),
        startTime: appointment.startTime,
        endTime: appointment.endTime,
      },
    };
  }
}
