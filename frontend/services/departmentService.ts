import axios, { API_URL } from "./baseService";
import { Department } from "../types/models";
import {
  CreateDepartmentRequest,
  DepartmentResponse,
  ListDepartments,
  UpdateDepartmentRequest,
} from "@/types/dtos";

export class DepartmentsService {
  static async getAllDepartments(
    includeWards?: boolean,
    includeBeds?: boolean,
  ): Promise<Department[]> {
    try {
      const response = await axios.get<ListDepartments>(
        `${API_URL}/api/departments`,
        {
          params: {
            includeWards: includeWards ? "true" : "false",
            includeBeds: includeBeds ? "true" : "false",
          },
        },
      );
      return response.data.departments;
    } catch (error) {
      console.error("Failed to fetch departments:", error);
      throw error;
    }
  }

  static async createDepartment(
    data: CreateDepartmentRequest,
  ): Promise<DepartmentResponse> {
    try {
      const response = await axios.post<DepartmentResponse>(
        `${API_URL}/api/departments`,
        data,
      );
      return response.data;
    } catch (error) {
      console.error("Failed to create department:", error);
      throw error;
    }
  }

  static async updateDepartment(
    id: string,
    data: UpdateDepartmentRequest,
  ): Promise<DepartmentResponse> {
    try {
      const response = await axios.put<DepartmentResponse>(
        `${API_URL}/api/departments/${id}`,
        data,
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to update department ${id}:`, error);
      throw error;
    }
  }

  static async deleteDepartment(id: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/api/departments/${id}`);
    } catch (error) {
      console.error(`Failed to delete department ${id}:`, error);
      throw error;
    }
  }
}
