import { Address, Hospital } from '../repo/entities/hospital.entity';

export type RepoCreateHospitalPayload = Omit<Hospital, 'id' | 'address'> & {
  address: Omit<Address, 'id'>;
};
