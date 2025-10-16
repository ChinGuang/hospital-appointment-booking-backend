import { BaseResponseZodType } from 'src/common/interface';
import { z } from 'zod';
import { HospitalZodType } from './base.dto';

export const CreateHospitalReqZodType = z.object({
  name: z.string().trim(),
  address: z.object({
    addressLine1: z.string().trim(),
    addressLine2: z.string().trim().optional(),
    city: z.string().trim(),
    state: z.string().trim(),
    postalCode: z.string().trim(),
    country: z.string().trim(),
  }),
  licenseNumber: z.string().trim(),
  smtpSetting: z
    .object({
      emailFrom: z.email().trim().optional(),
    })
    .nullish(),
  admin: z.object({
    username: z.string().trim(),
    email: z.email().trim(),
    password: z.string(),
  }),
});

export type CreateHospitalReq = z.infer<typeof CreateHospitalReqZodType>;

export const CreateHospitalResZodType = BaseResponseZodType.extend({
  data: HospitalZodType,
});

export type CreateHospitalRes = z.infer<typeof CreateHospitalResZodType>;
