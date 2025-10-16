import { z } from 'zod';
import { RegexUtils } from './regex';

const TimeZodType = z
  .string()
  .regex(RegexUtils.timeRegex, 'Invalid time format (HH:mm)');

export const ZodUtils = {
  TimeZodType,
};
