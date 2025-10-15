import { Injectable, NotFoundException } from '@nestjs/common';
import { HospitalRepoService } from '../hospitals/repo/hospital/hospital-repo.service';
import { CreateDoctorReq, CreateDoctorRes } from './dto/create-doctor.dto';
import { DeleteDoctorRes } from './dto/delete-doctor.dto';
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

@Injectable()
export class DoctorService {
  constructor(
    private readonly doctorRepoService: DoctorRepoService,
    private readonly specializationRepoService: SpecializationRepoService,
    private readonly languageRepoService: LanguageRepoService,
    private readonly hospitalRepoService: HospitalRepoService,
  ) {}

  async createDoctor(
    payload: CreateDoctorReq,
    hospitalId: number,
  ): Promise<CreateDoctorRes> {
    const specializations = await this.specializationRepoService.findElseCreate(
      payload.specializations,
    );
    const languages = await this.languageRepoService.findElseCreate(
      payload.spokenLangauges,
    );
    const hospital = await this.hospitalRepoService.findById(hospitalId);
    if (!hospital) {
      throw new NotFoundException('Hospital not found');
    }
    const doctor = await this.doctorRepoService.create({
      ...payload,
      specializations,
      spokenLangauges: languages,
      hospital,
    });
    return {
      message: 'Doctor created successfully',
      data: {
        id: doctor.id,
        fullName: doctor.fullName,
        experienceStartYear: doctor.experienceStartYear,
        specializations: doctor.specializations.map((s) => s.name),
        spokenLangauges: doctor.spokenLangauges.map((s) => s.name),
      },
    };
  }

  async viewDoctors(queries: ViewDoctorsReq): Promise<ViewDoctorsRes> {
    const page = queries.page || 1;
    const limit = queries.limit || 10;
    const doctors = await this.doctorRepoService.find({ page, limit });
    return {
      message: 'Doctors fetched successfully',
      data: doctors.map((doctor) => ({
        id: doctor.id,
        fullName: doctor.fullName,
        experienceStartYear: doctor.experienceStartYear,
        specializations: doctor.specializations.map((s) => s.name),
        spokenLangauges: doctor.spokenLangauges.map((s) => s.name),
      })),
    };
  }

  async viewDoctor(doctorId: number): Promise<ViewDoctorRes> {
    const doctor = await this.doctorRepoService.findById(doctorId);
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }
    return {
      message: 'Doctor fetched successfully',
      data: {
        id: doctor.id,
        fullName: doctor.fullName,
        experienceStartYear: doctor.experienceStartYear,
        specializations: doctor.specializations.map((s) => s.name),
        spokenLangauges: doctor.spokenLangauges.map((s) => s.name),
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
    const languages = payload.spokenLangauges
      ? await this.languageRepoService.findElseCreate(payload.spokenLangauges)
      : undefined;
    const updatePayload: Partial<Doctor> = {
      ...(payload.fullName !== undefined && { fullName: payload.fullName }),
      ...(payload.experienceStartYear !== undefined && {
        experienceStartYear: payload.experienceStartYear,
      }),
      ...(specializations !== undefined && { specializations }),
      ...(languages !== undefined && { spokenLangauges: languages }),
    };

    const doctor = await this.doctorRepoService.updateById(
      doctorId,
      updatePayload,
    );
    return {
      message: 'Doctor updated successfully',
      data: {
        id: doctor.id,
        fullName: doctor.fullName,
        experienceStartYear: doctor.experienceStartYear,
        specializations: doctor.specializations.map((s) => s.name),
        spokenLangauges: doctor.spokenLangauges.map((s) => s.name),
      },
    };
  }

  async deleteDoctor(doctorId: number): Promise<DeleteDoctorRes> {
    const doctor = await this.doctorRepoService.deleteById(doctorId);
    return {
      message: 'Doctor deleted successfully',
      data: {
        id: doctor.id,
        fullName: doctor.fullName,
        experienceStartYear: doctor.experienceStartYear,
        specializations: doctor.specializations.map((s) => s.name),
        spokenLangauges: doctor.spokenLangauges.map((s) => s.name),
      },
    };
  }
}
