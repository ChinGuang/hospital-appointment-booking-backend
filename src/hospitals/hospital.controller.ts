import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
    UseGuards,
    UsePipes,
} from '@nestjs/common';
import { AdminGuard } from '../common/guards/admin/admin.guard';
import { Permissions } from '../common/guards/permission/permission.decorator';
import { PermissionGuard } from '../common/guards/permission/permission.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { PermissionType } from '../permissions/enums/permission.enum';
import {
    type CreateHospitalReq,
    CreateHospitalReqZodType,
    CreateHospitalRes,
} from './dto/create-hospital.dto';
import {
    type ReadHospitalByIdRes,
    type ReadHospitalsReq,
    ReadHospitalsReqZodType,
    type ReadHospitalsRes,
} from './dto/read-hospital.dto';
import {
    type UpdateHospitalReq,
    UpdateHospitalReqZodType,
    UpdateHospitalRes,
} from './dto/update-hospital.dto';
import { HospitalService } from './hospital.service';

@Controller('hospitals')
export class HospitalController {
  constructor(private readonly hospitalService: HospitalService) {}

  @UseGuards(AdminGuard)
  @UsePipes(new ZodValidationPipe(CreateHospitalReqZodType))
  @Post()
  async createHospital(
    @Body() body: CreateHospitalReq,
  ): Promise<CreateHospitalRes> {
    return this.hospitalService.createHospital(body);
  }

  @Get(':id')
  async getHospitalById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ReadHospitalByIdRes> {
    return this.hospitalService.readHospitalById(id);
  }

  @Get()
  async getHospitals(
    @Query(new ZodValidationPipe(ReadHospitalsReqZodType))
    query: ReadHospitalsReq,
  ): Promise<ReadHospitalsRes> {
    return this.hospitalService.readHospitals(query);
  }

  @Permissions([PermissionType.UPDATE_HOSPITAL])
  @UseGuards(PermissionGuard)
  @UsePipes(new ZodValidationPipe(UpdateHospitalReqZodType))
  @Put(':id')
  async updateHospital(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateHospitalReq,
  ): Promise<UpdateHospitalRes> {
    return this.hospitalService.updateHospital(id, body);
  }
}
