import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Language } from '../../entities/language.entity';

@Injectable()
export class LanguageRepoService {
  constructor(
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
  ) {}

  async findElseCreate(names: string[]): Promise<Language[]> {
    const languages = await this.languageRepository.find({
      where: {
        name: In(names),
      },
    });

    const languagesToCreate = names.filter(
      (name) => !languages.some((s) => s.name === name),
    );

    const newLanguages = this.languageRepository.create(
      languagesToCreate.map((name) => ({ name })),
    );

    return [...languages, ...newLanguages];
  }
}
