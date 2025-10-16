import { z } from 'zod';
import { BaseResponseZodType } from '../../common/interface';
import { StaffZodType } from './base-staff.dto';

export const DeleteStaffResZodType = BaseResponseZodType.extend({
  data: StaffZodType,
});

export type DeleteStaffRes = z.infer<typeof DeleteStaffResZodType>;
