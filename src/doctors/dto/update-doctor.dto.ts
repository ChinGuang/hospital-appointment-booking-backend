import z from 'zod';
import { BaseResponseZodType } from '../../common/interface';
import { DoctorZodType } from './base-doctor.dto';

export const UpdateDoctorReqZodType = DoctorZodType.omit({
  id: true,
})
  .partial()
  .refine((data) => {
    return Object.values(data).length > 0;
  }, 'At least one field is required');

export type UpdateDoctorReq = z.infer<typeof UpdateDoctorReqZodType>;

export const UpdateDoctorResZodType = BaseResponseZodType.extend({
  data: DoctorZodType,
});

export type UpdateDoctorRes = z.infer<typeof UpdateDoctorResZodType>;
