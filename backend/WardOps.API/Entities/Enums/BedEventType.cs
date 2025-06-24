namespace WardOps.API.Entities.Enums;

public enum BedEventType
{
    Occupied,
    Freed,
    CleaningStarted,
    CleaningFinished,
    MaintenanceScheduled,
    MaintenanceCompleted,
    ReservationCreated,
    ReservationCancelled,
    StatusManuallyChanged
}
