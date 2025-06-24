export enum PositionType {
  Doctor = "Doctor",
  Nurse = "Nurse",
  HeadNurse = "HeadNurse",
  WardManager = "WardManager",
  Administrator = "Administrator",
  Receptionist = "Receptionist",
  CleaningStaff = "CleaningStaff",
  MaintenanceStaff = "MaintenanceStaff",
  PatientCoordinator = "PatientCoordinator",
  DepartmentHead = "DepartmentHead",
}

export enum WardGenderPolicy {
  MaleOnly = "MaleOnly",
  FemaleOnly = "FemaleOnly",
  Mixed = "Mixed",
  Child = "ChildOnly",
}

export enum BedStatus {
  Available = "Available",
  Occupied = "Occupied",
  Cleaning = "Cleaning",
  Maintenance = "Maintenance",
  Reserved = "Reserved",
  Unavailable = "Unavailable",
}

export enum HospitalizationStatus {
  Active = "Active",
  Discharged = "Discharged",
}

export enum PatientStatus {
  Registered = "Registered",
  Hospitalized = "Hospitalized",
  Discharged = "Discharged",
  Inactive = "Inactive",
}

export enum GenderType {
  Male = "Male",
  Female = "Female",
}
