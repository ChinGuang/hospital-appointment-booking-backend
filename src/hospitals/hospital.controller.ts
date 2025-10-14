import { Body, Controller, Get, Param, Post, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import {
  type CreateHospitalReq,
  CreateHospitalReqZodType,
  CreateHospitalRes,
} from './dto/create-hospital.dto';
import { ReadHospitalByIdRes } from './dto/read-hospital.dto';
import { HospitalService } from './hospital.service';

@Controller('hospitals')
export class HospitalController {
  constructor(private readonly hospitalService: HospitalService) {}

  @UsePipes(new ZodValidationPipe(CreateHospitalReqZodType))
  @Post()
  async createHospital(
    @Body() body: CreateHospitalReq,
  ): Promise<CreateHospitalRes> {
    return this.hospitalService.createHospital(body);
  }

  @Get(':id')
  async getHospitalById(@Param('id') id: string): Promise<ReadHospitalByIdRes> {
    if (isNaN(Number(id))) {
      throw new Error('Invalid ID format');
    }
    return this.hospitalService.readHospitalById(Number(id));
  }
}
