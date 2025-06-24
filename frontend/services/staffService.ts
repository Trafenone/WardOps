import axios, { API_URL } from "./baseService";
import { User } from "../types/models";
import {
  CreateStaffRequest,
  ListStaffResponse,
  UpdateStaffRequest,
} from "@/types/dtos";

export class StaffService {
  static async getAllStaff(): Promise<User[]> {
    try {
      const response = await axios.get<ListStaffResponse>(
        `${API_URL}/api/staff`,
      );

      return response.data.staffMembers;
    } catch (error) {
      console.error("Failed to fetch staff:", error);
      throw error;
    }
  }

  static async createStaff(data: CreateStaffRequest): Promise<User> {
    try {
      const response = await axios.post<User>(`${API_URL}/api/staff`, data);
      return response.data;
    } catch (error) {
      console.error("Failed to create staff member:", error);
      throw error;
    }
  }

  static async updateStaff(
    id: string,
    data: UpdateStaffRequest,
  ): Promise<User> {
    try {
      const response = await axios.put<User>(
        `${API_URL}/api/staff/${id}`,
        data,
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to update staff member ${id}:`, error);
      throw error;
    }
  }
}
