import { BaseResponseZodType } from 'src/common/interface';
import { z } from 'zod';
import { ZodUtils } from '../../common/utils/zod';

export const CreateAppointmentStaffReqZodType = z.object({
  patientId: z.number(),
  doctorId: z.number(),
  appointmentDate: z.iso.date(),
  startTime: ZodUtils.TimeZodType,
  endTime: ZodUtils.TimeZodType,
});

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
