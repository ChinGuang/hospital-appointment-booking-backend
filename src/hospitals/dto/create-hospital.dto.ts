import { BaseResponseZodType } from 'src/common/interface';
import z from 'zod';
import { HospitalZodType } from './base.dto';

export const CreateHospitalReqZodType = z.object({
  name: z.string(),
  address: z.object({
    addressLine1: z.string(),
    addressLine2: z.string().optional(),
    city: z.string(),
    state: z.string(),
    postalCode: z.string(),
    country: z.string(),
  }),
  licenseNumber: z.string(),
  smtpSetting: z
    .object({
      emailFrom: z.email().optional(),
    })
    .nullish(),
  admin: z.object({
    username: z.string(),
    email: z.email(),
    password: z.string(),
  }),
});

export type CreateHospitalReq = z.infer<typeof CreateHospitalReqZodType>;

export const CreateHospitalResZodType = BaseResponseZodType.extend({
  data: HospitalZodType,
});

export type CreateHospitalRes = z.infer<typeof CreateHospitalResZodType>;
