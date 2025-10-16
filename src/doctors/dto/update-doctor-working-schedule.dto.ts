import { z } from 'zod';
import { BaseResponseZodType } from '../../common/interface';
export const UpdateDoctorWorkingScheduleReqZodType = z.object({
  workingSchedule: z.array(
    z.object({
      dayOfWeek: z.number().min(0).max(6),
      startTime: z.string(),
      endTime: z.string(),
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
        startTime: z.string(),
        endTime: z.string(),
      }),
    ),
  },
);

export type UpdateDoctorWorkingScheduleRes = z.infer<
  typeof UpdateDoctorWorkingScheduleResZodType
>;
