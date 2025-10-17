import { z } from 'zod';
import { BaseResponseZodType } from '../../common/interface';
import { AppointmentStatus } from '../enums/appointment-status.enum';
import { AppointmentZodType } from './base-appointment.dto';

export const GetAppointmentsPatientReqZodType = z.object({
  doctorId: z.coerce.number().optional(),
  appointmentStartDate: z.iso.date().optional(),
  appointmentEndDate: z.iso.date().optional(),
  hospitalId: z.coerce.number().optional(),
  status: z.array(z.enum(AppointmentStatus)).optional(),
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
});

export type GetAppointmentsPatientReq = z.infer<
  typeof GetAppointmentsPatientReqZodType
>;

export const GetAppointmentsPatientResZodType = BaseResponseZodType.extend({
  data: z.array(AppointmentZodType),
});

export type GetAppointmentsPatientRes = z.infer<
  typeof GetAppointmentsPatientResZodType
>;

export const GetAppointmentsStaffReqZodType = z.object({
  doctorId: z.coerce.number().optional(),
  patientId: z.coerce.number().optional(),
  appointmentStartDate: z.iso.date().optional(),
  appointmentEndDate: z.iso.date().optional(),
  status: z.array(z.enum(AppointmentStatus)).optional(),
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
});

export type GetAppointmentsStaffReq = z.infer<
  typeof GetAppointmentsStaffReqZodType
>;

export const GetAppointmentsStaffResZodType = BaseResponseZodType.extend({
  data: z.array(AppointmentZodType),
});

export type GetAppointmentsStaffRes = z.infer<
  typeof GetAppointmentsStaffResZodType
>;
