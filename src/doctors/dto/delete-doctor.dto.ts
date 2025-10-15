import { BaseResponseZodType } from 'src/common/interface';
import z from 'zod';
import { DoctorZodType } from './base-doctor.dto';

export const DeleteDoctorResZodType = BaseResponseZodType.extend({
  data: DoctorZodType,
});

export type DeleteDoctorRes = z.infer<typeof DeleteDoctorResZodType>;
