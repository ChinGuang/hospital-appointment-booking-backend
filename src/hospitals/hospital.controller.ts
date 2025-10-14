import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import {
  type CreateHospitalReq,
  CreateHospitalReqZodType,
  CreateHospitalRes,
} from './dto/create-hospital.dto';
import { HospitalService } from './hospital.service';

@Controller('hospital')
export class HospitalController {
  constructor(private readonly hospitalService: HospitalService) {}

  @UsePipes(new ZodValidationPipe(CreateHospitalReqZodType))
  @Post()
  async createHospital(
    @Body() body: CreateHospitalReq,
  ): Promise<CreateHospitalRes> {
    return this.hospitalService.createHospital(body);
  }
}
