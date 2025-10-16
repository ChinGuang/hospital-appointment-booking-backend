import { z } from 'zod';
import { ZodUtils } from '../../common/utils/zod';

export const DoctorZodType = z.object({
  id: z.number(),
  fullName: z.string(),
  experienceStartYear: z.number().int().positive(),
  specializations: z.array(z.string()),
  spokenLanguages: z.array(z.string()),
  workingSchedule: z.array(
    z.object({
      dayOfWeek: z.number().min(0).max(6),
      startTime: ZodUtils.TimeZodType,
      endTime: ZodUtils.TimeZodType,
    }),
  ),
});

export type DoctorDto = z.infer<typeof DoctorZodType>;
