import {
  BedResponse,
  ChangeBedStatusRequest,
  CreateBedRequest,
  ListBedsResponse,
  UpdateBedRequest,
} from "@/types/dtos";
import axios, { API_URL } from "./baseService";

export class BedService {
  static async getMyBeds(): Promise<BedResponse[]> {
    try {
      const response = await axios.get<ListBedsResponse>(
        `${API_URL}/api/beds/my`,
      );
      return response.data.beds;
    } catch (error) {
      console.error("Failed to fetch my beds:", error);
      throw error;
    }
  }

  static async getAllBeds(): Promise<BedResponse[]> {
    try {
      const response = await axios.get<ListBedsResponse>(`${API_URL}/api/beds`);
      return response.data.beds;
    } catch (error) {
      console.error("Failed to fetch departments:", error);
      throw error;
    }
  }

  static async createBed(data: CreateBedRequest): Promise<BedResponse> {
    try {
      const response = await axios.post<BedResponse>(
        `${API_URL}/api/beds`,
        data,
      );
      return response.data;
    } catch (error) {
      console.error("Failed to create bed:", error);
      throw error;
    }
  }

  static async updateBed(
    id: string,
    data: UpdateBedRequest,
  ): Promise<BedResponse> {
    try {
      const response = await axios.put<BedResponse>(
        `${API_URL}/api/beds/${id}`,
        data,
      );
      return response.data;
    } catch (error) {
      console.error("Failed to update bed:", error);
      throw error;
    }
  }

  static async changeBedStatus(
    id: string,
    data: ChangeBedStatusRequest,
  ): Promise<BedResponse> {
    try {
      const response = await axios.patch<BedResponse>(
        `${API_URL}/api/beds/${id}/status`,
        data,
      );
      return response.data;
    } catch (error) {
      console.error("Failed to change bed status:", error);
      throw error;
    }
  }

  static async deleteBed(id: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/api/beds/${id}`);
    } catch (error) {
      console.error("Failed to delete bed:", error);
      throw error;
    }
  }
}
