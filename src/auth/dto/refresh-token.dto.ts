import { z } from 'zod';
import { BaseResponseZodType } from '../../common/interface';

export const RefreshTokenResZodType = BaseResponseZodType.extend({
  token: z.string(),
});

export type RefreshTokenRes = z.infer<typeof RefreshTokenResZodType>;
