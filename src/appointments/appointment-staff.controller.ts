import { Body, Controller, Post, UseGuards, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { Permissions } from '../common/guards/permission/permission.decorator';
import { PermissionGuard } from '../common/guards/permission/permission.guard';
import { PermissionType } from '../permissions/enums/permission.enum';
import { AppointmentService } from './appointment.service';
import {
  CreateAppointmentStaffReqZodType,
  type CreateAppointmentStaffReq,
} from './dto/create-appointment.dto';

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
}
