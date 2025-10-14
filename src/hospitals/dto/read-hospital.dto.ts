import z from 'zod';
import { BaseResponseZodType } from '../../common/interface';
import { HospitalZodType } from './base.dto';

export const ReadHospitalByIdResZodType = BaseResponseZodType.extend({
  data: HospitalZodType,
});
export type ReadHospitalByIdRes = z.infer<typeof ReadHospitalByIdResZodType>;

export const ReadHospitalsReqZodType = z.object({
  page: z.number(),
  limit: z.number(),
});

export type ReadHospitalsReq = z.infer<typeof ReadHospitalsReqZodType>;

export const ReadHospitalsResZodType = BaseResponseZodType.extend({
  data: z.array(HospitalZodType),
});

export type ReadHospitalsRes = z.infer<typeof ReadHospitalsResZodType>;
