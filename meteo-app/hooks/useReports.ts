import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { WeatherReport } from "@/lib/types";
import { toast } from "sonner";

export function useReports() {
  const [reports, setReports] = useState<WeatherReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get<WeatherReport[]>("/reports", {
        headers: {
          "Cache-Control": "no-cache",
        },
      });
      if (!response.data) throw new Error("Brak danych");
      setError(null);
      setReports(response.data);
    } catch (err) {
      console.error(err);
      setError("Could not fetch weather reports");
      toast.error("Could not fetch weather reports");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return { reports, setReports, loading, error, fetchReports };
}
