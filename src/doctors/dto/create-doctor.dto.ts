import { BaseResponseZodType } from 'src/common/interface';
import z from 'zod';
import { DoctorZodType } from './base-doctor.dto';

export const CreateDoctorReqZodType = z.object({
  fullName: z.string(),
  experienceStartYear: z.number().int().positive(),
  specializations: z.array(z.string()),
  spokenLanguages: z.array(z.string()),
});

export type CreateDoctorReq = z.infer<typeof CreateDoctorReqZodType>;

export const CreateDoctorResZodType = BaseResponseZodType.extend({
  data: DoctorZodType,
});

export type CreateDoctorRes = z.infer<typeof CreateDoctorResZodType>;
