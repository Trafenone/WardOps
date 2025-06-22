import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStatusBadge, getStatusIcon } from "./common";
import { BedIcon, Building2, MapPin, RotateCcw, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BedResponse } from "@/types/dtos";
import { BedStatus } from "@/types/enums";

interface BedStatusListProps {
  filteredBeds: BedResponse[];
  handleChangeStatus: (bed: BedResponse) => void;
}

export function BedStatusList({
  filteredBeds,
  handleChangeStatus,
}: BedStatusListProps) {
  return (
    <div className="space-y-4 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredBeds.map((bed) => (
          <Card
            key={bed.id}
            className="hover:shadow-md transition-shadow flex flex-col h-full"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(bed.status)}
                  <CardTitle className="text-lg">{bed.bedNumber}</CardTitle>
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Building2 className="h-3 w-3" />
                {bed.departmentName}
                <span className="mx-1">•</span>
                <MapPin className="h-3 w-3" />
                Палата {bed.wardNumber}
              </div>
            </CardHeader>
            <CardContent className="space-y-3 flex-1 flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Статус:</span>
                {getStatusBadge(bed.status)}
              </div>

              {bed.patientName && (
                <div className="flex items-center gap-2">
                  <User className="h-3 w-3 text-gray-500" />
                  <span className="text-sm">{bed.patientName}</span>
                </div>
              )}

              {bed.notes && (
                <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                  {bed.notes}
                </div>
              )}

              <div className="flex gap-2 pt-2 mt-auto">
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => handleChangeStatus(bed)}
                  disabled={
                    bed.status === BedStatus.Occupied ||
                    bed.status === BedStatus.Unavailable
                  }
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Змінити статус
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBeds.length === 0 && (
        <div className="text-center py-12">
          <BedIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Ліжка не знайдено
          </h3>
          <p className="text-gray-600">
            Спробуйте змінити фільтри або пошуковий запит
          </p>
        </div>
      )}
    </div>
  );
}
