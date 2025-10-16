import { z } from 'zod';

export enum UserType {
  ADMIN = 1,
  STAFF = 2,
  PATIENT = 3,
}
export const UserTypeZodEnum = z.enum(UserType);
