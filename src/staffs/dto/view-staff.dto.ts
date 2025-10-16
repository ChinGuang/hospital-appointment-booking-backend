import z from 'zod';
import { BaseResponseZodType } from '../../common/interface';
import { StaffZodType } from './base-staff.dto';

export const ViewStaffByIdResZodType = BaseResponseZodType.extend({
  data: StaffZodType,
});

export type ViewStaffByIdRes = z.infer<typeof ViewStaffByIdResZodType>;
