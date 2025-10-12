import { z } from 'zod';
import { BaseResponse } from '../../common/interface';

export const RegisterReqZodType = z.object({
  username: z.string(),
  password: z.string(),
  email: z.email(),
});

export type RegisterReq = z.infer<typeof RegisterReqZodType>;

export type RegisterRes = BaseResponse;
