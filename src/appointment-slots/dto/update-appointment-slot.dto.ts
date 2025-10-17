import { z } from 'zod';
import { BaseResponseZodType } from '../../common/interface';
import { ZodUtils } from '../../common/utils/zod';

export const UpdateAppointmentSlotReqZodType = z.object({
  appointmentSlots: z.array(
    z.object({
      dayOfWeek: z.number().min(0).max(6),
      startTime: ZodUtils.TimeZodType,
      endTime: ZodUtils.TimeZodType,
    }),
  ),
});

export type UpdateAppointmentSlotReq = z.infer<
  typeof UpdateAppointmentSlotReqZodType
>;

export const UpdateAppointmentSlotResZodType = BaseResponseZodType.extend({
  data: z.array(
    z.object({
      dayOfWeek: z.number().min(0).max(6),
      startTime: ZodUtils.TimeZodType,
      endTime: ZodUtils.TimeZodType,
    }),
  ),
});

export type UpdateAppointmentSlotRes = z.infer<
  typeof UpdateAppointmentSlotResZodType
>;
