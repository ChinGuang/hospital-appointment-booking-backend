import z from 'zod';

export const HospitalZodType = z.object({
  id: z.number(),
  name: z.string(),
  licenseNumber: z.string(),
  address: z.object({
    id: z.number(),
    addressLine1: z.string(),
    addressLine2: z.string().nullish(),
    city: z.string(),
    state: z.string(),
    postalCode: z.string(),
    country: z.string(),
  }),
});
