import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { Request } from 'express';
import { Staff } from 'src/staffs/entities/staff.entity';
import { Permissions } from '../common/guards/permission/permission.decorator';
import { PermissionGuard } from '../common/guards/permission/permission.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { PermissionType } from '../permissions/enums/permission.enum';
import { AppointmentService } from './appointment.service';
import { CancelAppointmentRes } from './dto/cancel-appointment.dto';
import {
  CreateAppointmentStaffReqZodType,
  type CreateAppointmentStaffReq,
} from './dto/create-appointment.dto';
import {
  GetAppointmentsStaffReqZodType,
  type GetAppointmentsStaffReq,
} from './dto/get-appointment.dto';

@Controller('/appointments/staff')
export class AppointmentStaffController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Permissions([PermissionType.CREATE_APPOINTMENT])
  @UseGuards(PermissionGuard)
  @UsePipes(new ZodValidationPipe(CreateAppointmentStaffReqZodType))
  @Post()
  async createAppointment(@Body() body: CreateAppointmentStaffReq) {
    return this.appointmentService.createAppointmentFromStaff(body);
  }

  @Permissions([PermissionType.VIEW_APPOINTMENT])
  @UseGuards(PermissionGuard)
  @Get()
  async getAppointments(
    @Req() request: Request & { staff?: Staff },
    @Query(new ZodValidationPipe(GetAppointmentsStaffReqZodType))
    query: GetAppointmentsStaffReq,
  ) {
    if (!request.staff) {
      throw new ForbiddenException('Access denied: Staff only');
    }
    return this.appointmentService.getAppointmentsFromStaff(
      query,
      request.staff.hospital.id,
    );
  }

  @Delete(':id')
  @UseGuards(PermissionGuard)
  @Permissions([PermissionType.CANCEL_APPOINTMENT])
  async cancelAppointment(
    @Req() req: Request & { user: Staff },
    @Param('id') id: number,
  ): Promise<CancelAppointmentRes> {
    const hospitalId = req.user.hospital.id;
    return this.appointmentService.cancelAppointment(id, { hospitalId });
  }
}
