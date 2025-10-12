import { z } from 'zod';
import { BaseResponse } from '../../common/interface';
import { Argon2Utils } from '../../common/utils/argon2';

export const RegisterReqZodType = z.object({
  username: z.string(),
  //auto hash password
  password: z.string().transform(async (val) => {
    return Argon2Utils.hashPassword(val);
  }),
  email: z.email(),
});

export type RegisterReq = z.infer<typeof RegisterReqZodType>;

export type RegisterRes = BaseResponse;
