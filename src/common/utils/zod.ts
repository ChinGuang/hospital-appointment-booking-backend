import z from 'zod';

const TimeZodType = z
  .string()
  .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:mm)');

export const ZodUtils = {
  TimeZodType,
};
