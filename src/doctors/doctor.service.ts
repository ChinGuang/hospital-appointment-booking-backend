import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { HospitalRepoService } from '../hospitals/repo/hospital/hospital-repo.service';
import { CreateDoctorReq, CreateDoctorRes } from './dto/create-doctor.dto';
import { DeleteDoctorRes } from './dto/delete-doctor.dto';
import {
  UpdateDoctorWorkingScheduleReq,
  UpdateDoctorWorkingScheduleRes,
} from './dto/update-doctor-working-schedule.dto';
import { UpdateDoctorReq, UpdateDoctorRes } from './dto/update-doctor.dto';
import {
  ViewDoctorRes,
  ViewDoctorsReq,
  ViewDoctorsRes,
} from './dto/view-doctor.dto';
import { Doctor } from './entities/doctor.entity';
import { DoctorRepoService } from './repo/doctor/doctor-repo.service';
import { LanguageRepoService } from './repo/language/language-repo.service';
import { SpecializationRepoService } from './repo/specialization/specialization-repo.service';
import { WorkingScheduleRepoService } from './repo/working-schedule/working-schedule-repo.service';

@Injectable()
export class DoctorService {
  constructor(
    private readonly doctorRepoService: DoctorRepoService,
    private readonly specializationRepoService: SpecializationRepoService,
    private readonly languageRepoService: LanguageRepoService,
    private readonly hospitalRepoService: HospitalRepoService,
    private readonly workingScheduleRepoService: WorkingScheduleRepoService,
    private readonly dataSource: DataSource,
  ) {}

  async createDoctor(
    payload: CreateDoctorReq,
    hospitalId: number,
  ): Promise<CreateDoctorRes> {
    const specializations = await this.specializationRepoService.findElseCreate(
      payload.specializations,
    );
    const languages = await this.languageRepoService.findElseCreate(
      payload.spokenLanguages,
    );
    const hospital = await this.hospitalRepoService.findById(hospitalId);
    if (!hospital) {
      throw new NotFoundException('Hospital not found');
    }
    const doctor = await this.doctorRepoService.create({
      ...payload,
      specializations,
      spokenLanguages: languages,
      hospital,
    });
    return {
      message: 'Doctor created successfully',
      data: {
        id: doctor.id,
        fullName: doctor.fullName,
        experienceStartYear: doctor.experienceStartYear,
        specializations: doctor.specializations.map((s) => s.name),
        spokenLanguages: doctor.spokenLanguages.map((s) => s.name),
        workingSchedule: [],
      },
    };
  }

  async viewDoctors(queries: ViewDoctorsReq): Promise<ViewDoctorsRes> {
    const page = queries.page || 1;
    const limit = queries.limit || 10;
    const doctors = await this.doctorRepoService.find(
      { page, limit },
      queries.hospitalId,
    );

    const workingSchedules =
      await this.workingScheduleRepoService.findByDoctorIds(
        doctors.map((doctor) => doctor.id),
      );

    return {
      message: 'Doctors fetched successfully',
      data: doctors.map((doctor) => ({
        id: doctor.id,
        fullName: doctor.fullName,
        experienceStartYear: doctor.experienceStartYear,
        specializations: doctor.specializations.map((s) => s.name),
        spokenLanguages: doctor.spokenLanguages.map((s) => s.name),
        workingSchedule: workingSchedules.filter(
          (workingSchedule) => workingSchedule.doctor.id === doctor.id,
        ),
      })),
    };
  }

  async viewDoctor(doctorId: number): Promise<ViewDoctorRes> {
    const doctor = await this.doctorRepoService.findById(doctorId);
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }
    const workingSchedule =
      await this.workingScheduleRepoService.findByDoctorId(doctorId);
    return {
      message: 'Doctor fetched successfully',
      data: {
        id: doctor.id,
        fullName: doctor.fullName,
        experienceStartYear: doctor.experienceStartYear,
        specializations: doctor.specializations.map((s) => s.name),
        spokenLanguages: doctor.spokenLanguages.map((s) => s.name),
        workingSchedule,
      },
    };
  }

  async updateDoctor(
    doctorId: number,
    payload: UpdateDoctorReq,
  ): Promise<UpdateDoctorRes> {
    const specializations = payload.specializations
      ? await this.specializationRepoService.findElseCreate(
          payload.specializations,
        )
      : undefined;
    const languages = payload.spokenLanguages
      ? await this.languageRepoService.findElseCreate(payload.spokenLanguages)
      : undefined;
    const updatePayload: Partial<Doctor> = {
      ...(payload.fullName !== undefined && { fullName: payload.fullName }),
      ...(payload.experienceStartYear !== undefined && {
        experienceStartYear: payload.experienceStartYear,
      }),
      ...(specializations !== undefined && { specializations }),
      ...(languages !== undefined && { spokenLanguages: languages }),
    };

    const doctor = await this.doctorRepoService.updateById(
      doctorId,
      updatePayload,
    );
    const workingSchedule =
      await this.workingScheduleRepoService.findByDoctorId(doctorId);
    return {
      message: 'Doctor updated successfully',
      data: {
        id: doctor.id,
        fullName: doctor.fullName,
        experienceStartYear: doctor.experienceStartYear,
        specializations: doctor.specializations.map((s) => s.name),
        spokenLanguages: doctor.spokenLanguages.map((s) => s.name),
        workingSchedule,
      },
    };
  }

  async updateDoctorWorkingSchedule(
    doctorId: number,
    payload: UpdateDoctorWorkingScheduleReq,
  ): Promise<UpdateDoctorWorkingScheduleRes> {
    const doctor = await this.doctorRepoService.findById(doctorId);
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }
    const workingSchedules = await this.dataSource.transaction(
      async (manager) => {
        await this.workingScheduleRepoService.deleteByDoctorIdWithinTransaction(
          doctorId,
          manager,
        );
        return await this.workingScheduleRepoService.create(
          payload.workingSchedule,
          doctorId,
          manager,
        );
      },
    );
    return {
      message: 'Doctor working schedule updated successfully',
      data: workingSchedules,
    };
  }

  async deleteDoctor(doctorId: number): Promise<DeleteDoctorRes> {
    const doctor = await this.doctorRepoService.deleteById(doctorId);
    const workingSchedule =
      await this.workingScheduleRepoService.findByDoctorId(doctorId);
    return {
      message: 'Doctor deleted successfully',
      data: {
        id: doctor.id,
        fullName: doctor.fullName,
        experienceStartYear: doctor.experienceStartYear,
        specializations: doctor.specializations.map((s) => s.name),
        spokenLanguages: doctor.spokenLanguages.map((s) => s.name),
        workingSchedule,
      },
    };
  }
}
