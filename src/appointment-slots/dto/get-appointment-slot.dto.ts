import { z } from 'zod';
import { BaseResponseZodType } from '../../common/interface';
import { ZodUtils } from '../../common/utils/zod';

export const GetDoctorAppointmentSlotsResZodType = BaseResponseZodType.extend({
  data: z.array(
    z.object({
      dayOfWeek: z.number().min(0).max(6),
      startTime: ZodUtils.TimeZodType,
      endTime: ZodUtils.TimeZodType,
    }),
  ),
});

export type GetDoctorAppointmentSlotsRes = z.infer<
  typeof GetDoctorAppointmentSlotsResZodType
>;

export const GetAppointmentSlotsReqZodType = z.object({
  doctorId: z.coerce.number().optional(),
  hospitalId: z.coerce.number().optional(),
  dayOfWeek: z.array(z.coerce.number().min(0).max(6)).optional(),
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
});

export type GetAppointmentSlotsReq = z.infer<
  typeof GetAppointmentSlotsReqZodType
>;

export const GetAppointmentSlotsResZodType = BaseResponseZodType.extend({
  data: z.array(
    z.object({
      dayOfWeek: z.number().min(0).max(6),
      startTime: ZodUtils.TimeZodType,
      endTime: ZodUtils.TimeZodType,
    }),
  ),
});

export type GetAppointmentSlotsRes = z.infer<
  typeof GetAppointmentSlotsResZodType
>;
