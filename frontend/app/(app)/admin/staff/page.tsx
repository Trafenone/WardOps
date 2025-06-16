"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserPlus, Search, Mail, Users, Edit } from "lucide-react";
import type { Department } from "@/types/models";
import { translatePositionType } from "@/lib/utils";
import { DepartmentsService } from "@/services";
import { toast } from "sonner";

import { useStaffManagement } from "./hooks/useStaffManagement";
import { AddStaffDialog } from "./components/AddStaffDialog";
import { EditStaffDialog } from "./components/EditStaffDialog";

export default function StaffManagement() {
  const {
    staffMembers,
    isLoading,
    searchTerm,
    setSearchTerm,
    selectedDepartment,
    setSelectedDepartment,
    dialogState,
    setDialogState,
    createForm,
    updateForm,
    fetchStaff,
    filterStaff,
    handlers,
  } = useStaffManagement();

  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchStaff();
        const depts = await DepartmentsService.getAllDepartments();
        setDepartments(depts);
      } catch (error) {
        console.error("Failed to load data:", error);
        toast.error("Помилка при завантаженні даних");
      }
    };

    loadData();
  }, [fetchStaff]);

  const getInitials = (firstName: string, lastName: string) =>
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  const getStatusBadge = (isActive: boolean) =>
    isActive ? (
      <Badge className="bg-green-100 text-green-800">Активний</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">Неактивний</Badge>
    );

  const formatLastLogin = (lastLogin?: Date) => {
    if (!lastLogin) return "Ніколи";
    return new Date(lastLogin).toLocaleString("uk-UA");
  };

  const handleOpenAddStaff = () => {
    createForm.reset();
    setDialogState((prev) => ({ ...prev, isAddStaffOpen: true }));
  };

  const handleOpenEditStaff = (staffId: string) => {
    const staff = staffMembers.find((s) => s.id === staffId);
    if (staff) {
      updateForm.setValue("firstName", staff.firstName);
      updateForm.setValue("lastName", staff.lastName);
      updateForm.setValue("position", staff.position);
      updateForm.setValue("departmentId", staff.departmentId || "");
      updateForm.setValue("isActive", staff.isActive);
      setDialogState((prev) => ({
        ...prev,
        isEditStaffOpen: true,
        selectedStaff: staffId,
      }));
    }
  };

  const departmentStats = departments.map((dept) => {
    const deptStaff = Array.isArray(staffMembers)
      ? staffMembers.filter((s) => s.departmentId === dept.id)
      : [];
    const activeStaff = deptStaff.filter((s) => s.isActive);
    return {
      id: dept.id,
      name: dept.name,
      total: deptStaff.length,
      active: activeStaff.length,
      percentage:
        deptStaff.length > 0
          ? Math.round((activeStaff.length / deptStaff.length) * 100)
          : 0,
    };
  });

  const filteredStaffMembers = filterStaff();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Управління персоналом</h2>
          <p className="text-gray-600">
            Додавання, редагування та управління співробітниками
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Пошук співробітників..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select
            value={selectedDepartment}
            onValueChange={setSelectedDepartment}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Відділення" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Всі відділення</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleOpenAddStaff}>
            <UserPlus className="h-4 w-4 mr-2" />
            Додати співробітника
          </Button>
        </div>
      </div>

      <Tabs defaultValue="staff">
        <TabsList>
          <TabsTrigger value="staff">Співробітники</TabsTrigger>
          <TabsTrigger value="departments">По відділеннях</TabsTrigger>
        </TabsList>

        <TabsContent value="staff" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                Список співробітників ({filteredStaffMembers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Співробітник</TableHead>
                    <TableHead>Посада</TableHead>
                    <TableHead>Відділення</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Останній вхід</TableHead>
                    <TableHead>Дії</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Завантаження...
                      </TableCell>
                    </TableRow>
                  ) : filteredStaffMembers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Не знайдено співробітників, що відповідають критеріям
                        пошуку
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredStaffMembers.map((staff) => {
                      const department = departments.find(
                        (d) => d.id === staff.departmentId,
                      );
                      return (
                        <TableRow key={staff.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>
                                  {getInitials(staff.firstName, staff.lastName)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">
                                  {staff.firstName} {staff.lastName}
                                </div>
                                <div className="text-sm text-gray-500 flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  {staff.email}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {translatePositionType(staff.position)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {department?.name || "Немає відділення"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(staff.isActive)}
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {formatLastLogin(staff.lastLogin)}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenEditStaff(staff.id)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departmentStats.map((dept) => (
              <Card key={dept.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {dept.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Всього співробітників:
                      </span>
                      <span className="font-medium">{dept.total}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Активних:</span>
                      <span className="font-medium text-green-600">
                        {dept.active}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Неактивних:</span>
                      <span className="font-medium text-red-600">
                        {dept.total - dept.active}
                      </span>
                    </div>
                    <div className="pt-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Активність</span>
                        <span>{dept.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${dept.percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <AddStaffDialog
        isOpen={dialogState.isAddStaffOpen}
        onClose={() =>
          setDialogState((prev) => ({ ...prev, isAddStaffOpen: false }))
        }
        form={createForm}
        departments={departments}
        onSubmit={handlers.handleAddStaff}
        isLoading={isLoading}
      />

      <EditStaffDialog
        isOpen={dialogState.isEditStaffOpen}
        onClose={() =>
          setDialogState((prev) => ({ ...prev, isEditStaffOpen: false }))
        }
        form={updateForm}
        departments={departments}
        onSubmit={handlers.handleEditStaff}
        isLoading={isLoading}
      />
    </div>
  );
}
