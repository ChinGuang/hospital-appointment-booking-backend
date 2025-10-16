import {
  Body,
  Controller,
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
import { Permissions } from '../common/guards/permission/permission.decorator';
import { PermissionGuard } from '../common/guards/permission/permission.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { PermissionType } from '../permissions/enums/permission.enum';
import {
  type CreateStaffReq,
  CreateStaffReqZodType,
  CreateStaffRes,
} from './dto/create-staff.dto';
import {
  type UpdateStaffReq,
  UpdateStaffReqZodType,
  UpdateStaffRes,
} from './dto/update-staff.dto';
import {
  ViewStaffByIdRes,
  type ViewStaffsReq,
  ViewStaffsReqZodType,
  ViewStaffsRes,
} from './dto/view-staff.dto';
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
    @Req() request: Request & { staff?: Staff },
    @Body() payload: CreateStaffReq,
  ): Promise<CreateStaffRes> {
    if (!request?.staff) {
      throw new ForbiddenException('Access denied: Staff only');
    }
    const hospitalId = request.staff.hospital.id;
    return this.staffService.createStaff(payload, hospitalId);
  }

  @Permissions([PermissionType.VIEW_STAFF])
  @UseGuards(PermissionGuard)
  @Get(':id')
  async viewStaff(
    @Req() request: Request & { staff?: Staff },
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ViewStaffByIdRes> {
    if (!request?.staff) {
      throw new ForbiddenException('Access denied: Staff only');
    }
    const hospitalId = request.staff.hospital.id;
    return this.staffService.viewStaff(id, hospitalId);
  }

  @Permissions([PermissionType.VIEW_STAFF])
  @UseGuards(PermissionGuard)
  @UsePipes(new ZodValidationPipe(ViewStaffsReqZodType))
  @Get()
  async viewStaffs(
    @Req() request: Request & { staff?: Staff },
    @Query() query: ViewStaffsReq,
  ): Promise<ViewStaffsRes> {
    if (!request?.staff) {
      throw new ForbiddenException('Access denied: Staff only');
    }
    const hospitalId = request.staff.hospital.id;
    return this.staffService.viewStaffs(query, hospitalId);
  }

  //Delete staff

  @Permissions([PermissionType.UPDATE_STAFF])
  @UseGuards(PermissionGuard)
  @UsePipes(new ZodValidationPipe(UpdateStaffReqZodType))
  @Put(':id')
  async updateStaff(
    @Req() request: Request & { staff?: Staff },
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateStaffReq,
  ): Promise<UpdateStaffRes> {
    if (!request?.staff) {
      throw new ForbiddenException('Access denied: Staff only');
    }
    const hospitalId = request.staff.hospital.id;
    return this.staffService.updateStaff(id, hospitalId, payload);
  }
}
