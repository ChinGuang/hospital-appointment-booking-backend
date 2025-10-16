import z from 'zod';
import { UserType } from '../../users/enums/user.enum';

export const StaffZodType = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
  userType: z.enum(UserType),
  hospitalId: z.number(),
});

export type Staff = z.infer<typeof StaffZodType>;
