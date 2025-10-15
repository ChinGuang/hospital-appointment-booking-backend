import { BaseResponseZodType } from 'src/common/interface';
import z from 'zod';

export const CreateDoctorReqZodType = z.object({
  fullName: z.string(),
  experienceStartYear: z.number().int().positive(),
  specializations: z.array(z.string()),
  spokenLangauges: z.array(z.string()),
});

export type CreateDoctorReq = z.infer<typeof CreateDoctorReqZodType>;

export const CreateDoctorResZodType = BaseResponseZodType.extend({
  data: z.object({
    id: z.number(),
    fullName: z.string(),
    experienceStartYear: z.number().int().positive(),
    specializations: z.array(z.string()),
    spokenLangauges: z.array(z.string()),
  }),
});

export type CreateDoctorRes = z.infer<typeof CreateDoctorResZodType>;
