import z from 'zod';

export const DoctorZodType = z.object({
  id: z.number(),
  fullName: z.string(),
  experienceStartYear: z.number().int().positive(),
  specializations: z.array(z.string()),
  spokenLangauges: z.array(z.string()),
});

export type DoctorDto = z.infer<typeof DoctorZodType>;
