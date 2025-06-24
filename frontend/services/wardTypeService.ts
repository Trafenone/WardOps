import axios, { API_URL } from "./baseService";
import { WardType } from "../types/models";
import { ListWardTypesResponse } from "@/types/dtos";

export class WardTypesService {
  static async getAllWardTypes(): Promise<WardType[]> {
    try {
      const response = await axios.get<ListWardTypesResponse>(
        `${API_URL}/api/wardtypes`,
      );
      return response.data.wardTypes;
    } catch (error) {
      console.error("Failed to fetch ward types:", error);
      throw error;
    }
  }
}
