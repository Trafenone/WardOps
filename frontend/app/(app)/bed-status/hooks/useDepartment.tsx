import { Department } from "@/types/models";
import { DepartmentService } from "@/services/departmentService";
import { useEffect, useState } from "react";

export const useDepartment = () => {
  const [departments, setDepartments] = useState<Department[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDepartment = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await DepartmentService.getAllDepartments();
      setDepartments(response);
    } catch (err) {
      setError("Failed to fetch department details");
      console.error("Error fetching department details:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartment();
  }, []);

  return { departments, isLoading, error, fetchDepartment };
};
