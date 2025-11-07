"use client";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import DeleteReportDialog from "@/components/reports/DeleteReportDialog";
import EditReportDialog from "@/components/reports/EditReportDialog";
import { useMemo, useCallback } from "react";
import { toKelvin } from "@/lib/conversions";
import { WeatherReport } from "@/lib/types";
import type { SortDir, SortKey } from "./ReportsToolbar";
import { useSearchDebounce } from "@/hooks/useDebounce";

type Props = {
  reports: WeatherReport[];
  setReportsAction: (
    updater: WeatherReport[] | ((p: WeatherReport[]) => WeatherReport[]),
  ) => void;

  sortKey: SortKey;
  sortDir: SortDir;
  cityFilter: string;
};

export default function ReportsTable({
  reports,
  setReportsAction,
  sortKey,
  sortDir,
  cityFilter,
}: Props) {
  const debouncedCityFilter = useSearchDebounce(cityFilter, 300);

  const rows = useMemo(() => {
    const withLabels = reports.map((r) => {
      const k = toKelvin(r.temperature, r.unit);
      return {
        ...r,
        __k: k,
        tempLabel: Number.isFinite(k) ? `${k.toFixed(1)} K` : "—",
        dateLabel: r.date, // trzymamy yyyy-mm-dd
      };
    });

    const q = debouncedCityFilter.trim().toLowerCase();
    const filtered =
      q === ""
        ? withLabels
        : withLabels.filter((r) => r.city.toLowerCase().includes(q));

    const sorted = [...filtered].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "temperature") {
        cmp = (a.__k ?? 0) - (b.__k ?? 0);
      } else if (sortKey === "city") {
        cmp = a.city.localeCompare(b.city, "pl", { sensitivity: "base" });
      } else {
        // date — mamy yyyy-mm-dd, więc leksykograficznie jest OK
        cmp = a.date.localeCompare(b.date);
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return sorted;
  }, [reports, debouncedCityFilter, sortKey, sortDir]);

  const handleDelete = useCallback(
    (id: string) => {
      setReportsAction((prev) => prev.filter((x) => x.id !== id));
    },
    [setReportsAction],
  );

  const handleEdit = useCallback(
    (allReports: WeatherReport[]) => {
      setReportsAction(allReports);
    },
    [setReportsAction],
  );

  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        There are no weather reports
      </p>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="sticky top-0 bg-background text-center">
          <TableRow>
            <TableHead>City</TableHead>
            <TableHead>Temperature</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-[160px] text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="font-medium">{r.city}</TableCell>
              <TableCell>{r.tempLabel}</TableCell>
              <TableCell>{r.dateLabel}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <DeleteReportDialog
                    reportId={r.id}
                    onDeleteAction={handleDelete}
                  />
                  <EditReportDialog report={r} onEditAction={handleEdit} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
