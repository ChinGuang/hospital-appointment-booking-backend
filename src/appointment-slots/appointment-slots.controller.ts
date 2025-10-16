import {
  Body,
  Controller,
  ForbiddenException,
  Param,
  ParseIntPipe,
  Put,
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
  type UpdateAppointmentSlotReq,
  UpdateAppointmentSlotReqZodType,
  UpdateAppointmentSlotRes,
} from './dto/update-appointment-slot.dto';

@Controller('/appointment-slots')
export class AppointmentSlotController {
  constructor(
    private readonly appointmentSlotService: AppointmentSlotsService,
  ) {}

  // View doctor's appointment slots

  @Permissions([PermissionType.UPDATE_DOCTOR])
  @UseGuards(PermissionGuard)
  @UsePipes(new ZodValidationPipe(UpdateAppointmentSlotReqZodType))
  @Put('/:id')
  async updateDoctorAppointmentSlots(
    @Param('id', ParseIntPipe) doctorId: number,
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
