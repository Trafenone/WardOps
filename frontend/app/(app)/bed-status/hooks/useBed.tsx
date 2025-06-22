import { ChangeBedStatusFormValues } from "@/schemas/bed-schema";
import { BedService } from "@/services/bedService";
import { BedResponse } from "@/types/dtos";
import { useEffect, useState } from "react";

export const useBed = () => {
  const [beds, setBeds] = useState<BedResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBeds = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await BedService.getMyBeds();
      setBeds(response);
    } catch (err) {
      setError("Failed to fetch bed details");
      console.error("Error fetching bed details:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const changeBedStatus = async (
    bedId: string,
    data: ChangeBedStatusFormValues,
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedBed = await BedService.changeBedStatus(bedId, {
        status: data.status,
        notes: data.notes || undefined,
      });
      setBeds((prev) =>
        prev.map((bed) => (bed.id === bedId ? updatedBed : bed)),
      );
    } catch (err) {
      setError("Failed to change bed status");
      console.error("Error changing bed status:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBeds();
  }, []);

  return { beds, isLoading, error, fetchBeds, changeBedStatus };
};
