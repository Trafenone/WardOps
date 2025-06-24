import { useState, useEffect } from "react";
import {
  AdminDashboardStats,
  DashboardService,
  RecentBedActivity,
} from "@/services/adminDashboardStats";
import { toast } from "sonner";

export function useAdminDashboard() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [activities, setActivities] = useState<RecentBedActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActivitiesLoading, setIsActivitiesLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const statsData = await DashboardService.getAdminDashboardStats();
        setStats(statsData);
      } catch (error) {
        console.error("Failed to fetch admin dashboard stats:", error);
        toast.error("Не вдалося завантажити статистику для дашборду.");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchActivities = async () => {
      try {
        setIsActivitiesLoading(true);
        const activitiesData = await DashboardService.getRecentBedActivities();
        setActivities(activitiesData);
      } catch (error) {
        console.error("Failed to fetch recent activities:", error);
        toast.error("Не вдалося завантажити останні активності.");
      } finally {
        setIsActivitiesLoading(false);
      }
    };

    fetchData();
    fetchActivities();
  }, []);

  return { stats, isLoading, activities, isActivitiesLoading };
}
