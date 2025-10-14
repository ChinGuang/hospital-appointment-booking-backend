import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from '../entities/hospital.entity';

@Injectable()
export class AddressRepoService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  async create(address: Omit<Address, 'id'>): Promise<Address> {
    return this.addressRepository.save(address);
  }
}
