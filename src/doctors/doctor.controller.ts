import {
  Body,
  Controller,
  ForbiddenException,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
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
}
