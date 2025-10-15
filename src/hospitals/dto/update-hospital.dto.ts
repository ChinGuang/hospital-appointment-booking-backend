import z from 'zod';
import { BaseResponseZodType } from '../../common/interface';
import { HospitalZodType } from './base.dto';

export const UpdateHospitalReqZodType = HospitalZodType.pick({
  name: true,
})
  .partial()
  .refine(
    (obj) => Object.keys(obj).length > 0,
    'At least one field must be provided',
  );

export type UpdateHospitalReq = z.infer<typeof UpdateHospitalReqZodType>;

export const UpdateHospitalResZodType = BaseResponseZodType.extend({
  data: HospitalZodType,
});

export type UpdateHospitalRes = z.infer<typeof UpdateHospitalResZodType>;
