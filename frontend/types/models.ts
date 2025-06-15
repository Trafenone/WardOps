import { BedStatus, WardGenderPolicy } from "./enums";

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
