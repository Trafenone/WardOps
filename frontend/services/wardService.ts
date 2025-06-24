import axios, { API_URL } from "./baseService";
import {} from "../types/models";
import {
  CreateWardRequest,
  ListWardsResponse,
  UpdateWardRequest,
  WardResponse,
} from "@/types/dtos";

export class WardsService {
  static async getWardsByDepartment(
    departmentId: string,
  ): Promise<WardResponse[]> {
    try {
      const response = await axios.get<ListWardsResponse>(
        `${API_URL}/api/departments/${departmentId}/wards`,
      );
      return response.data.wards;
    } catch (error) {
      console.error(
        `Failed to fetch wards for department ${departmentId}:`,
        error,
      );
      throw error;
    }
  }

  static async getAllWards(): Promise<WardResponse[]> {
    try {
      const response = await axios.get<ListWardsResponse>(
        `${API_URL}/api/wards`,
      );
      return response.data.wards;
    } catch (error) {
      console.error("Failed to fetch all wards:", error);
      throw error;
    }
  }

  static async createWard(data: CreateWardRequest): Promise<WardResponse> {
    try {
      const response = await axios.post<WardResponse>(
        `${API_URL}/api/wards`,
        data,
      );
      return response.data;
    } catch (error) {
      console.error("Failed to create ward:", error);
      throw error;
    }
  }

  static async updateWard(
    id: string,
    data: UpdateWardRequest,
  ): Promise<WardResponse> {
    try {
      const response = await axios.put<WardResponse>(
        `${API_URL}/api/wards/${id}`,
        data,
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to update ward ${id}:`, error);
      throw error;
    }
  }

  static async deleteWard(id: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/api/wards/${id}`);
    } catch (error) {
      console.error(`Failed to delete ward ${id}:`, error);
      throw error;
    }
  }
}
