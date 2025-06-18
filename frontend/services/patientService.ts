import { Patient } from "@/types/models";
import axios, { API_URL } from "./baseService";
import {
  CreatePatientRequest,
  ListPatientsResponse,
  UpdatePatientRequest,
} from "@/types/dtos";

export class PatientService {
  static async getAllPatients(): Promise<Patient[]> {
    try {
      const response = await axios.get<ListPatientsResponse>(
        `${API_URL}/api/patients`,
      );
      return response.data.patients;
    } catch (error) {
      console.error("Failed to fetch patients:", error);
      throw error;
    }
  }

  static async createPatient(data: CreatePatientRequest): Promise<Patient> {
    try {
      const response = await axios.post<Patient>(
        `${API_URL}/api/patients`,
        data,
      );
      return response.data;
    } catch (error) {
      console.error("Failed to create patient:", error);
      throw error;
    }
  }

  static async updatePatient(
    id: string,
    data: UpdatePatientRequest,
  ): Promise<Patient> {
    try {
      console.log("Updating patient with ID:", id, "Data:", data);
      const response = await axios.put<Patient>(
        `${API_URL}/api/patients/${id}`,
        data,
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to update patient ${id}:`, error);
      throw error;
    }
  }

  static async deletePatient(id: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/api/patients/${id}`);
    } catch (error) {
      console.error(`Failed to delete patient ${id}:`, error);
      throw error;
    }
  }
}
