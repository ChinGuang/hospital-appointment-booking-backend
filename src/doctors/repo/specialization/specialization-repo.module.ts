import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Specialization } from '../../entities/specialization.entity';
import { SpecializationRepoService } from './specialization-repo.service';

@Module({
  imports: [TypeOrmModule.forFeature([Specialization])],
  providers: [SpecializationRepoService],
  exports: [SpecializationRepoService],
})
export class SpecializationRepoModule {}
