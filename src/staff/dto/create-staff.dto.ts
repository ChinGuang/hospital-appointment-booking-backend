import { z } from 'zod';
import { BaseResponseZodType } from '../../common/interface';
import { UserType } from '../../users/enums/user.enum';

export const CreateStaffReqZodType = z.object({
  username: z.string().trim(),
  email: z.email().trim(),
  password: z.string(),
  roleId: z.number(),
});

export type CreateStaffReq = z.infer<typeof CreateStaffReqZodType>;

export const CreateStaffResZodType = BaseResponseZodType.extend({
  data: z.object({
    id: z.number(),
    username: z.string(),
    email: z.string(),
    userType: z.enum(UserType),
    hospitalId: z.number(),
  }),
});

export type CreateStaffRes = z.infer<typeof CreateStaffResZodType>;
