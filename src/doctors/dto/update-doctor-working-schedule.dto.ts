import { z } from 'zod';
import { BaseResponseZodType } from '../../common/interface';
import { ZodUtils } from '../../common/utils/zod';
export const UpdateDoctorWorkingScheduleReqZodType = z.object({
  workingSchedule: z.array(
    z.object({
      dayOfWeek: z.number().min(0).max(6),
      startTime: ZodUtils.TimeZodType,
      endTime: ZodUtils.TimeZodType,
    }),
  ),
});

export type UpdateDoctorWorkingScheduleReq = z.infer<
  typeof UpdateDoctorWorkingScheduleReqZodType
>;

export const UpdateDoctorWorkingScheduleResZodType = BaseResponseZodType.extend(
  {
    data: z.array(
      z.object({
        dayOfWeek: z.number().min(0).max(6),
        startTime: ZodUtils.TimeZodType,
        endTime: ZodUtils.TimeZodType,
      }),
    ),
  },
);

export type UpdateDoctorWorkingScheduleRes = z.infer<
  typeof UpdateDoctorWorkingScheduleResZodType
>;
