import { BaseResponseZodType } from 'src/common/interface';
import { z } from 'zod';
import { AppointmentZodType } from './base-appointment.dto';

export const CancelAppointmentResZodType = BaseResponseZodType.extend({
  data: AppointmentZodType,
});

export type CancelAppointmentRes = z.infer<typeof CancelAppointmentResZodType>;
