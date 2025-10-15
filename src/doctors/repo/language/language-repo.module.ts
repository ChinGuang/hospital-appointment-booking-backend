import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Language } from '../../entities/language.entity';
import { LanguageRepoService } from './language-repo.service';

@Module({
  imports: [TypeOrmModule.forFeature([Language])],
  providers: [LanguageRepoService],
  exports: [LanguageRepoService],
})
export class LanguageRepoModule {}
