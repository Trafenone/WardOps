import {
  BedStatus,
  GenderType,
  HospitalizationStatus,
  PatientStatus,
  PositionType,
  WardGenderPolicy,
} from "./enums";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  position: PositionType;
  departmentId?: string;
  departmentName?: string;
  lastLogin?: Date;
  isActive: boolean;
}

export interface Department {
  id: string;
  name: string;
  building?: string;
  floorNumber?: number;
  description?: string;
  wards: Ward[];
}

export interface WardType {
  id: string;
  name: string;
  description?: string;
}

export interface Ward {
  id: string;
  departmentId: string;
  wardTypeId: string;
  wardNumber: string;
  genderPolicy: WardGenderPolicy;
  maxCapacity: number;
  notes?: string;
  beds: Bed[];
}

export interface Bed {
  id: string;
  wardId: string;
  bedNumber: string;
  status: BedStatus;
  notes?: string;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  dateOfBirth: Date;
  gender: GenderType;
  phoneNumber: string;
  medicalCardNumber: string;
  admissionDiagnosis: string;
  requiresIsolation: boolean;
  status: PatientStatus;
  notes?: string;
  hospitalizations?: Hospitalization[];
}

export interface Hospitalization {
  id: string;
  patientId: string;
  patientFullName: string;
  bedId: string;
  bedNumber: string;
  wardNumber: string;
  departmentName: string;
  admissionDateTime: Date;
  plannedDischargeDateTime?: Date;
  actualDischargeDateTime?: Date;
  admissionReason: string;
  dischargeReason?: string;
  status: HospitalizationStatus;
}
