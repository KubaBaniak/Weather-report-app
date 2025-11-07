"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ReportsToolbar, {
  SortDir,
  SortKey,
} from "@/components/reports/ReportsToolbar";
import ReportsTable from "@/components/reports/ReportsTable";
import { useReports } from "@/hooks/useReports";

export default function ReportsPage() {
  const { reports, setReports, loading, error, fetchReports } = useReports();

  const [cityFilter, setCityFilter] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  return (
    <div
      className="mx-auto max-w-5xl p-6"
      aria-busy={loading ? "true" : "false"}
    >
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Weather Reports</CardTitle>
          </div>
          <ReportsToolbar
            cityFilter={cityFilter}
            onCityFilterAction={setCityFilter}
            sortKey={sortKey}
            onSortKeyAction={setSortKey}
            sortDir={sortDir}
            onSortDirAction={setSortDir}
            onRefreshAction={fetchReports}
            onCreatedAction={setReports}
          />
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-2/3" />
              <Skeleton className="h-10 w-2/3" />
            </div>
          ) : error ? (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          ) : (
            <ReportsTable
              reports={reports}
              setReportsAction={setReports}
              sortKey={sortKey}
              sortDir={sortDir}
              cityFilter={cityFilter}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
