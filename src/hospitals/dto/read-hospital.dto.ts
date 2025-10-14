import z from 'zod';
import { BaseResponseZodType } from '../../common/interface';
import { HospitalZodType } from './base.dto';

export const ReadHospitalByIdResZodType = BaseResponseZodType.extend({
  data: HospitalZodType,
});
export type ReadHospitalByIdRes = z.infer<typeof ReadHospitalByIdResZodType>;
