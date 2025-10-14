import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Hospital {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  addressId: number;

  @Column()
  licenseNumber: string;
}

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  addressLine1: string;

  @Column({ nullable: true })
  addressLine2?: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  postalCode: string;

  @Column()
  country: string;
}

export class HospitalSmtpSetting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  hospitalId: number;

  @Column({ nullable: true })
  emailFrom?: string;
}
