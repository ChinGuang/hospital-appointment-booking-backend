import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Specialization } from '../../entities/specialization.entity';

@Injectable()
export class SpecializationRepoService {
  constructor(
    @InjectRepository(Specialization)
    private readonly specializationRepository: Repository<Specialization>,
  ) {}

  async findElseCreate(names: string[]): Promise<Specialization[]> {
    const specializations = await this.specializationRepository.find({
      where: {
        name: In(names),
      },
    });

    const specializationsToCreate = names.filter(
      (name) => !specializations.some((s) => s.name === name),
    );

    const newSpecializations = this.specializationRepository.create(
      specializationsToCreate.map((name) => ({ name })),
    );

    return [...specializations, ...newSpecializations];
  }
}
