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
    const unique = [...new Set(names.map((n) => n.trim()))].filter(Boolean);
    if (unique.length === 0) return [];
    const found = await this.languageRepository.find({
      where: { name: In(unique) },
    });
    const missing = unique.filter((n) => !found.some((f) => f.name === n));
    if (missing.length) {
      await this.languageRepository.upsert(
        missing.map((name) => ({ name })),
        ['name'],
      );
    }
    return this.languageRepository.find({ where: { name: In(unique) } });
  }
}
