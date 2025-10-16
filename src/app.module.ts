import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { DoctorModule } from './doctors/doctor.module';
import { HospitalModule } from './hospitals/hospital.module';
import { StaffModule } from './staffs/staff.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'nestuser',
      password: 'nestpass',
      database: 'nestdb',
      entities: [],
      synchronize: true,
      autoLoadEntities: true,
    }),
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    HospitalModule,
    StaffModule,
    DoctorModule,
  ],
})
export class AppModule {
  constructor(private readonly dataSource: DataSource) {}
}
