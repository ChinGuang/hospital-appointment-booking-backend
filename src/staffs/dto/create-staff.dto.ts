import { z } from 'zod';
import { BaseResponseZodType } from '../../common/interface';
import { StaffZodType } from './base-staff.dto';

export const CreateStaffReqZodType = z.object({
  username: z.string().trim(),
  email: z.email().trim(),
  password: z.string(),
  roleId: z.number(),
});

export type CreateStaffReq = z.infer<typeof CreateStaffReqZodType>;

export const CreateStaffResZodType = BaseResponseZodType.extend({
  data: StaffZodType,
});

export type CreateStaffRes = z.infer<typeof CreateStaffResZodType>;
