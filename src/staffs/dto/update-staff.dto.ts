import { z } from 'zod';
import { BaseResponseZodType } from '../../common/interface';
import { StaffZodType } from './base-staff.dto';

export const UpdateStaffReqZodType = z.object({
  roleId: z.number(),
});

export type UpdateStaffReq = z.infer<typeof UpdateStaffReqZodType>;

export const UpdateStaffResZodType = BaseResponseZodType.extend({
  data: StaffZodType,
});

export type UpdateStaffRes = z.infer<typeof UpdateStaffResZodType>;
