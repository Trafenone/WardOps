import { BedStatus, PositionType, WardGenderPolicy } from "./enums";
import { Department, User, WardType } from "./models";

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

export interface BedsResponse {
  id: string;
  wardId: string;
  bedNumber: string;
  status: BedStatus;
}

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
  beds: BedsResponse[];
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
