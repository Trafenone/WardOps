import { DepartmentWithWards, HospitalStructureResponse } from "@/types/dtos";
import axios, { API_URL } from "./baseService";

export class HospitalStructureService {
  static async getHospitalStructure(): Promise<DepartmentWithWards[]> {
    try {
      const response = await axios.get<HospitalStructureResponse>(
        `${API_URL}/api/departmentstructure`,
      );
      return response.data.departments;
    } catch (error) {
      console.error("Failed to fetch departments:", error);
      throw error;
    }
  }
}
