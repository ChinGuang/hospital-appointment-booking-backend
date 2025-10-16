import { z } from 'zod';
import { UserTypeZodEnum } from '../../users/enums/user.enum';

export const AuthenticateResZodType = z.object({
  userId: z.number(),
  username: z.string(),
  email: z.email(),
  userType: UserTypeZodEnum,
});
export type AuthenticateRes = z.infer<typeof AuthenticateResZodType>;
