import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import {
  type CreateHospitalReq,
  CreateHospitalReqZodType,
  CreateHospitalRes,
} from './dto/create-hospital.dto';
import { ReadHospitalByIdRes, ReadHospitalsRes } from './dto/read-hospital.dto';
import {
  type UpdateHospitalReq,
  UpdateHospitalReqZodType,
  UpdateHospitalRes,
} from './dto/update-hospital.dto';
import { HospitalService } from './hospital.service';

@Controller('hospitals')
export class HospitalController {
  constructor(private readonly hospitalService: HospitalService) {}

  //Admin only
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

  @Get()
  async getHospitals(
    @Query() query: { page?: string; limit?: string },
  ): Promise<ReadHospitalsRes> {
    const page = query.page ? parseInt(query.page, 10) : 1;
    const limit = query.limit ? parseInt(query.limit, 10) : 10;
    return this.hospitalService.readHospitals({ page, limit });
  }

  //Staff and Admin only
  @UsePipes(new ZodValidationPipe(UpdateHospitalReqZodType))
  @Put(':id')
  async updateHospital(
    @Param('id') id: string,
    @Body() body: UpdateHospitalReq,
  ): Promise<UpdateHospitalRes> {
    if (isNaN(Number(id))) {
      throw new Error('Invalid ID format');
    }
    return this.hospitalService.updateHospital(Number(id), body);
  }
}
