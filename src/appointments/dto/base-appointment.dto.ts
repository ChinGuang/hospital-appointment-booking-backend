import { ZodUtils } from 'src/common/utils/zod';
import { z } from 'zod';

export const AppointmentZodType = z.object({
  id: z.number(),
  patientId: z.number(),
  doctorId: z.number(),
  appointmentDate: z.iso.date(),
  startTime: ZodUtils.TimeZodType,
  endTime: ZodUtils.TimeZodType,
});

export type Appointment = z.infer<typeof AppointmentZodType>;
