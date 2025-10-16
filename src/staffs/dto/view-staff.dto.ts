import { z } from 'zod';
import { BaseResponseZodType } from '../../common/interface';
import { StaffZodType } from './base-staff.dto';

export const ViewStaffByIdResZodType = BaseResponseZodType.extend({
  data: StaffZodType,
});

export type ViewStaffByIdRes = z.infer<typeof ViewStaffByIdResZodType>;

export const ViewStaffsReqZodType = z.object({
  page: z.number().optional().default(1),
  limit: z.number().optional().default(10),
  search: z.string().optional(),
});

export type ViewStaffsReq = z.infer<typeof ViewStaffsReqZodType>;

export const ViewStaffsResZodType = BaseResponseZodType.extend({
  data: z.array(StaffZodType),
});

export type ViewStaffsRes = z.infer<typeof ViewStaffsResZodType>;
