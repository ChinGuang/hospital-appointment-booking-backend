import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Between,
  DataSource,
  FindOptionsWhere,
  In,
  LessThan,
  MoreThan,
} from 'typeorm';
import { EmailService } from '../common/services/email/email.service';
import { DoctorRepoService } from '../doctors/repo/doctor/doctor-repo.service';
import { HospitalSmtpSettingRepoService } from '../hospitals/repo/hospital-smtp-setting/hospital-smtp-setting-repo.service';
import { UserService } from '../users/user.service';
import { CancelAppointmentRes } from './dto/cancel-appointment.dto';
import {
  CreateAppointmentPatientReq,
  CreateAppointmentPatientRes,
  CreateAppointmentStaffReq,
  CreateAppointmentStaffRes,
} from './dto/create-appointment.dto';
import {
  GetAppointmentsPatientReq,
  GetAppointmentsPatientRes,
  GetAppointmentsStaffReq,
  GetAppointmentsStaffRes,
} from './dto/get-appointment.dto';
import { Appointment } from './entities/appointment.entity';
import { AppointmentStatus } from './enums/appointment-status.enum';
import { AppointmentRepoService } from './repo/appointment/appointment-repo.service';

@Injectable()
export class AppointmentService {
  constructor(
    private readonly appointmentRepoService: AppointmentRepoService,
    private readonly userService: UserService,
    private readonly doctorRepoService: DoctorRepoService,
    private readonly emailService: EmailService,
    private readonly hospitalSmtpSettingService: HospitalSmtpSettingRepoService,
    private readonly dataSource: DataSource,
  ) {}

  async createAppointmentFromStaff(
    createAppointmentStaffReq: CreateAppointmentStaffReq,
    hospitalId: number,
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
    if (!doctor || doctor.hospital.id !== hospitalId) {
      throw new NotFoundException('Doctor not found');
    }
    const appointmentDate = new Date(createAppointmentStaffReq.appointmentDate);
    const appointment =
      await this.appointmentRepoService.createWithAvailabilityCheck(
        {
          appointmentDate,
          startTime: createAppointmentStaffReq.startTime,
          endTime: createAppointmentStaffReq.endTime,
          doctor,
          patient,
          appointmentStatus: AppointmentStatus.SCHEDULED,
        },
        this.dataSource,
      );
    const hospital = appointment.doctor.hospital;
    const smtpSetting = await this.hospitalSmtpSettingService.findByHospitalId(
      hospital.id,
    );
    try {
      await this.sendEmail({
        appointment: {
          date: appointment.appointmentDate,
          startTime: appointment.startTime,
          endTime: appointment.endTime,
        },
        doctor: {
          name: appointment.doctor.fullName,
        },
        hospital: {
          name: hospital.name,
          address: `${hospital.address.addressLine1} ${hospital.address.addressLine2 ?? ''},`,
          smtpSetting: {
            email: smtpSetting?.emailFrom,
            appPassword: smtpSetting?.appPassword,
          },
        },
        patient: {
          email: patient.email,
          name: patient.username,
        },
      });
    } catch (error) {
      console.error('Failed to send appointment confirmation email:', error);
    }
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
    const hospital = appointment.doctor.hospital;
    const smtpSetting = await this.hospitalSmtpSettingService.findByHospitalId(
      hospital.id,
    );
    try {
      await this.sendEmail({
        appointment: {
          date: appointment.appointmentDate,
          startTime: appointment.startTime,
          endTime: appointment.endTime,
        },
        doctor: {
          name: appointment.doctor.fullName,
        },
        hospital: {
          name: hospital.name,
          address: `${hospital.address.addressLine1} ${hospital.address.addressLine2 ?? ''},`,
          smtpSetting: {
            email: smtpSetting?.emailFrom,
            appPassword: smtpSetting?.appPassword,
          },
        },
        patient: {
          email: patient.email,
          name: patient.username,
        },
      });
    } catch (error) {
      console.error('Failed to send appointment confirmation email:', error);
    }
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

  async getAppointmentsFromPatient(
    payload: GetAppointmentsPatientReq,
    patientId: number,
  ): Promise<GetAppointmentsPatientRes> {
    const appointmentDateWhere = {
      ...(payload.appointmentStartDate &&
        payload.appointmentEndDate && {
          appointmentDate: Between(
            new Date(payload.appointmentStartDate),
            new Date(payload.appointmentEndDate),
          ),
        }),
      ...(payload.appointmentStartDate &&
        !payload.appointmentEndDate && {
          appointmentDate: MoreThan(new Date(payload.appointmentStartDate)),
        }),
      ...(payload.appointmentEndDate &&
        !payload.appointmentStartDate && {
          appointmentDate: LessThan(new Date(payload.appointmentEndDate)),
        }),
    };
    const appointmentDoctorWhere = {
      ...(payload.doctorId && { id: payload.doctorId }),
      ...(payload.hospitalId && { hospital: { id: payload.hospitalId } }),
    };
    const where: FindOptionsWhere<Appointment> = {
      ...(Object.keys(appointmentDoctorWhere).length > 0 && {
        doctor: appointmentDoctorWhere,
      }),
      ...appointmentDateWhere,
      ...(payload.status && { appointmentStatus: In(payload.status) }),
      patient: { id: patientId },
    };
    const take = payload.limit || 10;
    const page = payload.page || 1;
    const skip = (page - 1) * take;
    const appointments = await this.appointmentRepoService.findAppointments(
      where,
      take,
      skip,
    );
    return {
      message: 'Appointments retrieved successfully',
      data: appointments.map((appointment) => ({
        id: appointment.id,
        patientId: appointment.patient.id,
        doctorId: appointment.doctor.id,
        appointmentDate: appointment.appointmentDate.toISOString(),
        startTime: appointment.startTime,
        endTime: appointment.endTime,
      })),
    };
  }

  async getAppointmentsFromStaff(
    payload: GetAppointmentsStaffReq,
    hospitalId: number,
  ): Promise<GetAppointmentsStaffRes> {
    const appointmentDateWhere = {
      ...(payload.appointmentStartDate &&
        payload.appointmentEndDate && {
          appointmentDate: Between(
            new Date(payload.appointmentStartDate),
            new Date(payload.appointmentEndDate),
          ),
        }),
      ...(payload.appointmentStartDate &&
        !payload.appointmentEndDate && {
          appointmentDate: MoreThan(new Date(payload.appointmentStartDate)),
        }),
      ...(payload.appointmentEndDate &&
        !payload.appointmentStartDate && {
          appointmentDate: LessThan(new Date(payload.appointmentEndDate)),
        }),
    };
    const where: FindOptionsWhere<Appointment> = {
      doctor: {
        hospital: { id: hospitalId },
        ...(payload.doctorId && { id: payload.doctorId }),
      },
      ...appointmentDateWhere,
      ...(payload.status && { appointmentStatus: In(payload.status) }),
      ...(payload.patientId && { patient: { id: payload.patientId } }),
    };
    const take = payload.limit || 10;
    const page = payload.page || 1;
    const skip = (page - 1) * take;
    const appointments = await this.appointmentRepoService.findAppointments(
      where,
      take,
      skip,
    );
    return {
      message: 'Appointments retrieved successfully',
      data: appointments.map((appointment) => ({
        id: appointment.id,
        patientId: appointment.patient.id,
        doctorId: appointment.doctor.id,
        appointmentDate: appointment.appointmentDate.toISOString(),
        startTime: appointment.startTime,
        endTime: appointment.endTime,
      })),
    };
  }

  async cancelAppointment(
    appointmentId: number,
    from: {
      patientId?: number;
      hospitalId?: number;
    },
  ): Promise<CancelAppointmentRes> {
    const appointment = await this.appointmentRepoService.cancelAppointment(
      appointmentId,
      from,
    );
    return {
      message: 'Appointment cancelled successfully',
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

  async sendEmail(payload: {
    hospital: {
      name: string;
      smtpSetting: {
        email?: string;
        appPassword?: string;
      };
      address: string;
    };
    patient: {
      name: string;
      email: string;
    };
    appointment: {
      date: Date;
      startTime: string;
      endTime: string;
    };
    doctor: {
      name: string;
    };
  }): Promise<void> {
    await this.emailService.sendEmail({
      sender: {
        email: payload.hospital.smtpSetting.email,
        appPassword: payload.hospital.smtpSetting.appPassword,
      },
      mail: {
        to: payload.patient.email,
        subject: `Appointment Confirmation - ${payload.hospital.name}`,
        text: `Dear ${payload.patient.name},

Thank you for booking your appointment with ${payload.hospital.name}.
We are pleased to confirm your appointment details as follows:

Appointment Details:

Date: ${payload.appointment.date.toLocaleDateString()}

Time: ${payload.appointment.startTime} - ${payload.appointment.endTime}

Doctor: ${payload.doctor.name}

Location: ${payload.hospital.address}

Please arrive at least 15 minutes before your scheduled time for registration and preparation.

We look forward to seeing you soon and providing you with the best care.

Warm regards,
${payload.hospital.name}
`,
      },
    });
  }
}
