import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { Request } from 'express';
import { Permissions } from '../common/guards/permission/permission.decorator';
import { PermissionGuard } from '../common/guards/permission/permission.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { PermissionType } from '../permissions/enums/permission.enum';
import { Staff } from '../staff/entities/staff.entity';
import { DoctorService } from './doctor.service';
import {
  type CreateDoctorReq,
  CreateDoctorReqZodType,
  CreateDoctorRes,
} from './dto/create-doctor.dto';
import { DeleteDoctorRes } from './dto/delete-doctor.dto';
import {
  type UpdateDoctorReq,
  UpdateDoctorReqZodType,
  UpdateDoctorRes,
} from './dto/update-doctor.dto';
import {
  ViewDoctorRes,
  type ViewDoctorsReq,
  ViewDoctorsReqZodType,
  ViewDoctorsRes,
} from './dto/view-doctor.dto';

@Controller()
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Permissions([PermissionType.CREATE_DOCTOR])
  @UseGuards(PermissionGuard)
  @UsePipes(new ZodValidationPipe(CreateDoctorReqZodType))
  @Post('doctor')
  async createDoctor(
    @Req() req: Request & { staff?: Staff },
    @Body() body: CreateDoctorReq,
  ): Promise<CreateDoctorRes> {
    if (!req.staff) {
      throw new ForbiddenException('Access denied: Staff only');
    }
    return await this.doctorService.createDoctor(body, req.staff?.hospital.id);
  }

  @Get('doctors')
  async viewDoctors(
    @Query(new ZodValidationPipe(ViewDoctorsReqZodType))
    queries: ViewDoctorsReq,
  ): Promise<ViewDoctorsRes> {
    return await this.doctorService.viewDoctors(queries);
  }

  @Get('doctors/:id')
  async viewDoctor(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ViewDoctorRes> {
    return await this.doctorService.viewDoctor(id);
  }

  @Permissions([PermissionType.UPDATE_DOCTOR])
  @UseGuards(PermissionGuard)
  @Put('doctors/:id')
  @UsePipes(new ZodValidationPipe(UpdateDoctorReqZodType))
  async updateDoctor(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateDoctorReq,
  ): Promise<UpdateDoctorRes> {
    return await this.doctorService.updateDoctor(id, body);
  }

  @Permissions([PermissionType.DELETE_DOCTOR])
  @UseGuards(PermissionGuard)
  @Delete('doctors/:id')
  async deleteDoctor(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DeleteDoctorRes> {
    return await this.doctorService.deleteDoctor(id);
  }
}
