import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { Permissions } from '../common/guards/permission/permission.decorator';
import { PermissionGuard } from '../common/guards/permission/permission.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { PermissionType } from '../permissions/enums/permission.enum';
import { Staff } from '../staffs/entities/staff.entity';
import { AppointmentSlotsService } from './appointment-slots.service';
import {
  type GetAppointmentSlotsReq,
  GetAppointmentSlotsReqZodType,
  GetAppointmentSlotsRes,
  GetDoctorAppointmentSlotsRes,
} from './dto/get-appointment-slot.dto';
import {
  type UpdateAppointmentSlotReq,
  UpdateAppointmentSlotReqZodType,
  UpdateAppointmentSlotRes,
} from './dto/update-appointment-slot.dto';

@Controller('/appointment-slots')
export class AppointmentSlotController {
  constructor(
    private readonly appointmentSlotService: AppointmentSlotsService,
  ) {}

  @Get('/:doctorId')
  async getDoctorAppointmentSlots(
    @Param('doctorId', ParseIntPipe) doctorId: number,
  ): Promise<GetDoctorAppointmentSlotsRes> {
    return await this.appointmentSlotService.readDoctorAppointmentSlots(
      doctorId,
    );
  }

  @Get()
  async getAppointmentSlots(
    @Query(new ZodValidationPipe(GetAppointmentSlotsReqZodType))
    query: GetAppointmentSlotsReq,
  ): Promise<GetAppointmentSlotsRes> {
    return await this.appointmentSlotService.readAppointmentSlots(query);
  }

  @Permissions([PermissionType.UPDATE_DOCTOR])
  @UseGuards(PermissionGuard)
  @UsePipes(new ZodValidationPipe(UpdateAppointmentSlotReqZodType))
  @Put('/:doctorId')
  async updateDoctorAppointmentSlots(
    @Param('doctorId', ParseIntPipe) doctorId: number,
    @Body() body: UpdateAppointmentSlotReq,
    @Req() req: Request & { staff?: Staff },
  ): Promise<UpdateAppointmentSlotRes> {
    if (!req.staff) {
      throw new ForbiddenException('Access denied: Staff only');
    }
    return await this.appointmentSlotService.updateDoctorAppointmentSlots(
      doctorId,
      req.staff?.hospital.id,
      body,
    );
  }
}
