import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Specialization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;
}
