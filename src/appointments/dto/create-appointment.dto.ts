import { BaseResponseZodType } from 'src/common/interface';
import { z } from 'zod';
import { ZodUtils } from '../../common/utils/zod';
import { AppointmentZodType } from './base-appointment.dto';

export const CreateAppointmentStaffReqZodType = z
  .object({
    patientId: z.number(),
    doctorId: z.number(),
    appointmentDate: z.iso.date(),
    startTime: ZodUtils.TimeZodType,
    endTime: ZodUtils.TimeZodType,
  })
  .refine(
    (data) => {
      const startTime = data.startTime.split(':');
      const endTime = data.endTime.split(':');
      const startHour = parseInt(startTime[0]);
      const startMinute = parseInt(startTime[1]);
      const endHour = parseInt(endTime[0]);
      const endMinute = parseInt(endTime[1]);
      const start = startHour * 60 + startMinute;
      const end = endHour * 60 + endMinute;
      return start < end;
    },
    {
      message: 'Start time must be before end time',
      path: ['endTime'],
    },
  );

export type CreateAppointmentStaffReq = z.infer<
  typeof CreateAppointmentStaffReqZodType
>;

export const CreateAppointmentStaffResZodType = BaseResponseZodType.extend({
  data: z.object({
    id: z.number(),
    patientId: z.number(),
    doctorId: z.number(),
    appointmentDate: z.iso.date(),
    startTime: ZodUtils.TimeZodType,
    endTime: ZodUtils.TimeZodType,
  }),
});

export type CreateAppointmentStaffRes = z.infer<
  typeof CreateAppointmentStaffResZodType
>;

export const CreateAppointmentPatientReqZodType = z
  .object({
    doctorId: z.number(),
    appointmentDate: z.iso.date(),
    startTime: ZodUtils.TimeZodType,
    endTime: ZodUtils.TimeZodType,
  })
  .refine(
    (data) => {
      const startTime = data.startTime.split(':');
      const endTime = data.endTime.split(':');
      const startHour = parseInt(startTime[0]);
      const startMinute = parseInt(startTime[1]);
      const endHour = parseInt(endTime[0]);
      const endMinute = parseInt(endTime[1]);
      const start = startHour * 60 + startMinute;
      const end = endHour * 60 + endMinute;
      return start < end;
    },
    {
      message: 'Start time must be before end time',
      path: ['endTime'],
    },
  );

export type CreateAppointmentPatientReq = z.infer<
  typeof CreateAppointmentPatientReqZodType
>;

export const CreateAppointmentPatientResZodType = BaseResponseZodType.extend({
  data: AppointmentZodType,
});

export type CreateAppointmentPatientRes = z.infer<
  typeof CreateAppointmentPatientResZodType
>;
