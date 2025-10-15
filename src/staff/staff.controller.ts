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
import {
  type CreateStaffReq,
  CreateStaffReqZodType,
  CreateStaffRes,
} from './dto/create-staff.dto';
import { Staff } from './entities/staff.entity';
import { StaffService } from './staff.service';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Permissions([PermissionType.CREATE_STAFF])
  @UseGuards(PermissionGuard)
  @UsePipes(new ZodValidationPipe(CreateStaffReqZodType))
  @Post()
  async createStaff(
    @Req() request: unknown,
    @Body() payload: CreateStaffReq,
  ): Promise<CreateStaffRes> {
    if (!request || typeof request !== 'object' || !request['staff']) {
      throw new ForbiddenException('Access denied: Staff only');
    }
    const hospitalId = (request['staff'] as Staff).hospital.id;
    return this.staffService.createStaff(payload, hospitalId);
  }
}
