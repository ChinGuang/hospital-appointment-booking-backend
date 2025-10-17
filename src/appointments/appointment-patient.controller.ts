import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthUserGuard } from '../common/guards/auth-user/auth-user.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { User } from '../users/entities/user.entity';
import { AppointmentService } from './appointment.service';
import { CancelAppointmentRes } from './dto/cancel-appointment.dto';
import {
  CreateAppointmentPatientReqZodType,
  CreateAppointmentPatientRes,
  type CreateAppointmentPatientReq,
} from './dto/create-appointment.dto';
import {
  GetAppointmentsPatientReqZodType,
  GetAppointmentsPatientRes,
  type GetAppointmentsPatientReq,
} from './dto/get-appointment.dto';

@Controller('appointments/patient')
export class AppointmentPatientController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @UseGuards(AuthUserGuard)
  @UsePipes(new ZodValidationPipe(CreateAppointmentPatientReqZodType))
  async createAppointment(
    @Req() req: Request & { user: User },
    @Body() body: CreateAppointmentPatientReq,
  ): Promise<CreateAppointmentPatientRes> {
    const patientId = req.user.id;
    return this.appointmentService.createAppointmentFromPatient(
      body,
      patientId,
    );
  }

  @Get()
  @UseGuards(AuthUserGuard)
  async getAppointments(
    @Req() req: Request & { user: User },
    @Query(new ZodValidationPipe(GetAppointmentsPatientReqZodType))
    query: GetAppointmentsPatientReq,
  ): Promise<GetAppointmentsPatientRes> {
    const patientId = req.user.id;
    return this.appointmentService.getAppointmentsFromPatient(query, patientId);
  }

  @Delete(':id')
  @UseGuards(AuthUserGuard)
  async cancelAppointment(
    @Req() req: Request & { user: User },
    @Param('id') id: number,
  ): Promise<CancelAppointmentRes> {
    const patientId = req.user.id;
    return this.appointmentService.cancelAppointment(id, { patientId });
  }
}
