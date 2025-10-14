import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from '../entities/hospital.entity';
import { AddressRepoService } from './address-repo.service';
@Module({
  imports: [TypeOrmModule.forFeature([Address])],
  providers: [AddressRepoService],
  exports: [AddressRepoService],
})
export class AddressRepoModule {}
