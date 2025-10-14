import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

@Entity()
export class Hospital {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToOne(() => Address, { cascade: true })
  @JoinColumn()
  address: Address;

  @Column()
  licenseNumber: string;
}

@Entity()
export class HospitalSmtpSetting {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Hospital)
  @JoinColumn()
  hospital: Hospital;

  @Column({ nullable: true })
  emailFrom?: string;
}
