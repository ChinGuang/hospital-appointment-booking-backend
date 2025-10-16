import { z } from 'zod';
import { BaseResponseZodType } from '../../common/interface';

export const LoginReqZodType = z.object({
  username: z.string(),
  password: z.string(),
});

export type LoginReq = z.infer<typeof LoginReqZodType>;

export const LoginResZodType = BaseResponseZodType.extend({
  token: z.string(),
});

export type LoginRes = z.infer<typeof LoginResZodType>;
