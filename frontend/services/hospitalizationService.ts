import axios from "axios";
import { API_URL } from "./baseService";
import {
  CreateHospitalizationRequest,
  DischargePatientRequest,
  ListHospitalizationsResponse,
} from "@/types/dtos";
import { Hospitalization } from "@/types/models";

export class HospitalizationService {
  static async getAllHospitalizations(): Promise<Hospitalization[]> {
    try {
      const response = await axios.get<ListHospitalizationsResponse>(
        `${API_URL}/api/hospitalizations`,
      );
      return response.data.hospitalizations;
    } catch (error) {
      console.error("Failed to fetch hospitalizations:", error);
      throw error;
    }
  }

  static async createHospitalization(
    data: CreateHospitalizationRequest,
  ): Promise<Hospitalization> {
    try {
      const response = await axios.post<Hospitalization>(
        `${API_URL}/api/hospitalizations`,
        data,
      );
      return response.data;
    } catch (error) {
      console.error("Failed to create hospitalization:", error);
      throw error;
    }
  }

  static async dischargePatientByPatientId(
    id: string,
    data: DischargePatientRequest,
  ): Promise<Hospitalization> {
    try {
      const response = await axios.post<Hospitalization>(
        `${API_URL}/api/patients/${id}/hospitalization/discharge`,
        data,
      );
      return response.data;
    } catch (error) {
      console.error("Failed to discharge patient:", error);
      throw error;
    }
  }
}
