import axios, { API_URL } from "./baseService";

export interface AdminDashboardStats {
  totalActivePatients: number;
  occupiedBeds: number;
  totalBeds: number;
  bedOccupancyPercentage: number;
  totalDepartments: number;
}

export interface RecentBedActivity {
  id: string;
  timestamp: string;
  description: string;
  userName: string | null;
}

interface ListRecentBedActivityResponse {
  activities: RecentBedActivity[];
}

export class DashboardService {
  static async getAdminDashboardStats(): Promise<AdminDashboardStats> {
    try {
      const response = await axios.get<AdminDashboardStats>(
        `${API_URL}/api/dashboard/admin-stats`,
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch departments:", error);
      throw error;
    }
  }

  static async getRecentBedActivities(): Promise<RecentBedActivity[]> {
    try {
      const response = await axios.get<ListRecentBedActivityResponse>(
        `${API_URL}/api/dashboard/recent-bed-activity`,
      );
      return response.data.activities;
    } catch (error) {
      console.error("Failed to fetch bed activities:", error);
      throw error;
    }
  }
}
