import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BedResponse } from "@/types/dtos";
import { BedStatus } from "@/types/enums";

interface BedStatsCardsProps {
  beds: BedResponse[];
}

export const BedStatsCards: React.FC<BedStatsCardsProps> = ({ beds }) => {
  const totalBeds = beds.length;
  const availableBeds = beds.filter(
    (bed) => bed.status === BedStatus.Available,
  ).length;
  const occupiedBeds = beds.filter(
    (bed) => bed.status === BedStatus.Occupied,
  ).length;
  const maintenanceBeds = beds.filter(
    (bed) =>
      bed.status === BedStatus.Cleaning || bed.status === BedStatus.Maintenance,
  ).length;
  const reservedBeds = beds.filter(
    (bed) => bed.status === BedStatus.Reserved,
  ).length;
  const unavailableBeds = beds.filter(
    (bed) => bed.status === BedStatus.Unavailable,
  ).length;

  const occupancyRate =
    totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;
  const availabilityRate =
    totalBeds > 0 ? Math.round((availableBeds / totalBeds) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Всього ліжок</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalBeds}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-green-700">
            Вільно
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-700">
            {availableBeds}
          </div>
          <p className="text-xs text-gray-500">{availabilityRate}% доступно</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-red-700">
            Зайнято
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-700">{occupiedBeds}</div>
          <p className="text-xs text-gray-500">{occupancyRate}% зайнято</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-yellow-700">
            Обслуговування
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-700">
            {maintenanceBeds}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-blue-700">
            Зарезервовано
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-700">{reservedBeds}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-purple-700">
            Недоступно
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-700">
            {unavailableBeds}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
