import axios from "axios";
import { API_URL } from "./baseService";
import {
  CreateHospitalizationRequest,
  DischargePatientRequest,
  HospitalizationResponse,
} from "@/types/dtos";

export class HospitalizationService {
  static async createHospitalization(
    data: CreateHospitalizationRequest,
  ): Promise<HospitalizationResponse> {
    try {
      const response = await axios.post<HospitalizationResponse>(
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
  ): Promise<HospitalizationResponse> {
    try {
      const response = await axios.post<HospitalizationResponse>(
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
