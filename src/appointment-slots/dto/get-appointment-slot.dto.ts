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
