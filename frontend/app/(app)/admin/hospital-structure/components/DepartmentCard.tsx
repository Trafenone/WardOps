import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Edit, Building2, MapPin, Layers } from "lucide-react";
import { DepartmentWithWards } from "@/types/dtos";
import { WardType } from "@/types/models";
import { WardCard } from "./WardCard";

interface DepartmentCardProps {
  department: DepartmentWithWards;
  wardTypes: WardType[];
  onEditDepartment: (departmentId: string) => void;
  onDeleteDepartment: (departmentId: string) => void;
  onAddWard: (departmentId: string) => void;
  onEditWard: (wardId: string) => void;
  onDeleteWard: (wardId: string) => void;
}

export const DepartmentCard: React.FC<DepartmentCardProps> = ({
  department,
  wardTypes,
  onEditDepartment,
  onDeleteDepartment,
  onAddWard,
  onEditWard,
  onDeleteWard,
}) => (
  <Card key={department.id}>
    <CardHeader>
      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {department.name}
          </CardTitle>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {department.building}
            </div>
            <div className="flex items-center gap-1">
              <Layers className="h-3 w-3" />
              {department.floorNumber} поверх
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onEditDepartment(department.id)}
            title="Редагувати відділення"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onDeleteDepartment(department.id)}
            title="Видалити відділення"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      {department.description && (
        <p className="text-sm text-gray-600">{department.description}</p>
      )}

      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium">Палати ({department.wards.length})</h4>
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            onClick={() => onAddWard(department.id)}
          >
            <Plus className="h-3 w-3 mr-1" />
            Додати палату
          </Button>
        </div>

        {department.wards.length > 0 ? (
          <div className="space-y-2">
            {department.wards.map((ward) => (
              <WardCard
                key={ward.id}
                ward={ward}
                wardType={wardTypes.find((wt) => wt.id === ward.wardTypeId)}
                onEdit={onEditWard}
                onDelete={onDeleteWard}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">
            Немає палат у цьому відділенні
          </p>
        )}
      </div>
    </CardContent>
  </Card>
);
