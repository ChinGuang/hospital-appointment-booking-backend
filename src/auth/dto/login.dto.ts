import z from 'zod';
import { BaseResponseZodType } from '../../common/interface';
import { Argon2Utils } from '../../common/utils/argon2';

export const LoginReqZodType = z.object({
  username: z.string(),
  password: z.string().transform(async (val) => {
    return Argon2Utils.hashPassword(val);
  }),
});

export type LoginReq = z.infer<typeof LoginReqZodType>;

export const LoginResZodType = BaseResponseZodType.extend({
  token: z.string(),
});

export type LoginRes = z.infer<typeof LoginResZodType>;
