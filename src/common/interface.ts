import { z } from 'zod';

export const BaseResponseZodType = z.object({
  message: z.string(),
});

export type BaseResponse = z.infer<typeof BaseResponseZodType>;
