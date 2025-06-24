import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BedResponse } from "@/types/dtos";
import { BedStatus } from "@/types/enums";

interface BedStatusStatsProps {
  filteredBeds: BedResponse[];
}

export function BedStatusStats({ filteredBeds }: BedStatusStatsProps) {
  const totalBeds = filteredBeds.length;
  const availableBeds = filteredBeds.filter(
    (bed) => bed.status === BedStatus.Available,
  ).length;
  const needsAttention = filteredBeds.filter(
    (bed) =>
      bed.status === BedStatus.Cleaning || bed.status === BedStatus.Maintenance,
  ).length;
  const occupiedBeds = filteredBeds.filter(
    (bed) => bed.status === BedStatus.Occupied,
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Всього ліжок</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalBeds}</div>
          <p className="text-xs text-gray-500">У вашому відділенні</p>
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
          <p className="text-xs text-gray-500">Готові до використання</p>
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
          <p className="text-xs text-gray-500">З пацієнтами</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-orange-700">
            Потребують уваги
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-700">
            {needsAttention}
          </div>
          <p className="text-xs text-gray-500">Прибирання/ремонт</p>
        </CardContent>
      </Card>
    </div>
  );
}
