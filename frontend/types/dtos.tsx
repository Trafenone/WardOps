import {
  BedStatus,
  GenderType,
  HospitalizationStatus,
  PatientStatus,
  PositionType,
  WardGenderPolicy,
} from "./enums";
import { Department, Hospitalization, Patient, User, WardType } from "./models";

export interface AuthResponse {
  token: string;
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  position: PositionType;
  departmentId?: string;
  lastLogin?: Date;
  isActive: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateDepartmentRequest {
  name: string;
  building?: string;
  floorNumber?: number;
  description?: string;
}

export type UpdateDepartmentRequest = CreateDepartmentRequest;

export interface DepartmentResponse {
  id: string;
  name: string;
  building?: string;
  floorNumber?: number;
  description?: string;
  wards?: WardResponse[];
}

export interface ListDepartmentsResponse {
  departments: DepartmentResponse[];
}

export interface ListDepartments {
  departments: Department[];
}

export interface WardResponse {
  id: string;
  departmentId: string;
  departmentName: string;
  wardTypeId: string;
  wardTypeName: string;
  wardNumber: string;
  genderPolicy: WardGenderPolicy;
  maxCapacity: number;
  notes?: string;
}

export interface BedResponse {
  id: string;
  wardId: string;
  wardNumber: string;
  bedNumber: string;
  departmentId: string;
  departmentName: string;
  status: BedStatus;
  patientId?: string | null;
  patientName?: string | null;
  notes?: string;
}

export interface ListBedsResponse {
  beds: BedResponse[];
}

export interface CreateBedRequest {
  bedNumber: string;
  departmentId: string;
  wardId: string;
  status: BedStatus;
  notes?: string;
}

export interface CreateHospitalizationRequest {
  patientId: string;
  bedId: string;
  admissionDateTime: Date;
  plannedDischargeDateTime?: Date;
  admissionReason?: string;
}

export interface DischargePatientRequest {
  dischargeReason?: string;
  actualDischargeDateTime: Date;
}

export interface ListHospitalizationsResponse {
  hospitalizations: Hospitalization[];
}

export interface HospitalizationResponse {
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
  admissionReason?: string;
  dischargeReason?: string;
  status: HospitalizationStatus;
}

export type UpdateBedRequest = CreateBedRequest;

export interface ListWardsResponse {
  wards: WardResponse[];
}

export interface CreateWardRequest {
  departmentId: string;
  wardTypeId: string;
  wardNumber: string;
  genderPolicy: WardGenderPolicy;
  maxCapacity: number;
  notes?: string;
}

export type UpdateWardRequest = CreateWardRequest;

export interface ListWardTypesResponse {
  wardTypes: WardType[];
}

export interface HospitalStructureResponse {
  departments: DepartmentWithWards[];
}

export interface DepartmentWithWards {
  id: string;
  name: string;
  building: string;
  floorNumber: number;
  description: string;
  wards: WardWithBeds[];
}

export interface WardWithBeds {
  id: string;
  departmentId: string;
  departmentName: string;
  wardTypeId: string;
  wardTypeName: string;
  wardNumber: string;
  genderPolicy: WardGenderPolicy;
  maxCapacity: number;
  notes?: string;
  beds: BedResponse[];
}

export interface ListStaffResponse {
  staffMembers: User[];
}

export interface CreateStaffRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  position: PositionType;
  departmentId?: string;
  isActive: boolean;
}

export interface UpdateStaffRequest {
  firstName: string;
  lastName: string;
  position: PositionType;
  departmentId?: string;
  isActive: boolean;
}

export interface ListPatientsResponse {
  patients: Patient[];
}

export interface CreatePatientRequest {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: GenderType;
  phoneNumber: string;
  medicalCardNumber: string;
  admissionDiagnosis: string;
  requiresIsolation: boolean;
  status: PatientStatus;
  notes?: string;
}

export type UpdatePatientRequest = CreatePatientRequest;
