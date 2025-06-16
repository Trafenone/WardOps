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
  Maintenance = "Maintenance",
  Reserved = "Reserved",
}
