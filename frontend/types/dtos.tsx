import { BedStatus, WardGenderPolicy } from "./enums";
import { Department, WardType } from "./models";

export interface CreateDepartmentRequest {
  name: string;
  building?: string;
  floorNumber?: number;
  description?: string;
}

export interface UpdateDepartmentRequest extends CreateDepartmentRequest {}

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

export interface UpdateWardRequest extends CreateWardRequest {}

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
