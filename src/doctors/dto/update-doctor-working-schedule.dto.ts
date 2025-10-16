import { z } from 'zod';
import { BaseResponseZodType } from '../../common/interface';
export const UpdateDoctorWorkingScheduleReq = z.object({
  workingSchedule: z.array(
    z.object({
      dayOfWeek: z.number().min(0).max(6),
      startTime: z.string(),
      endTime: z.string(),
    }),
  ),
});

export type UpdateDoctorWorkingScheduleReq = z.infer<
  typeof UpdateDoctorWorkingScheduleReq
>;

export const UpdateDoctorWorkingScheduleRes = BaseResponseZodType.extend({
  data: z.array(
    z.object({
      dayOfWeek: z.number().min(0).max(6),
      startTime: z.string(),
      endTime: z.string(),
    }),
  ),
});

export type UpdateDoctorWorkingScheduleRes = z.infer<
  typeof UpdateDoctorWorkingScheduleRes
>;
