import { z } from 'zod';
import { BaseResponseZodType } from '../../common/interface';
import { ZodUtils } from '../../common/utils/zod';
import { DoctorZodType } from './base-doctor.dto';

export const ViewDoctorsReqZodType = z.object({
  hospitalId: z.coerce.number().optional(),
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
  dayOfWeeks: z.coerce.number().array().optional(),
  startTime: ZodUtils.TimeZodType.optional(),
  endTime: ZodUtils.TimeZodType.optional(),
});

export type ViewDoctorsReq = z.infer<typeof ViewDoctorsReqZodType>;

export const ViewDoctorsResZodType = BaseResponseZodType.extend({
  data: z.array(DoctorZodType),
});

export type ViewDoctorsRes = z.infer<typeof ViewDoctorsResZodType>;

export const ViewDoctorResZodType = BaseResponseZodType.extend({
  data: DoctorZodType,
});

export type ViewDoctorRes = z.infer<typeof ViewDoctorResZodType>;
