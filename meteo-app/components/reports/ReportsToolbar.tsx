"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AddReportDialog from "@/components/reports/AddReportDialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { WeatherReport } from "@/lib/types";
import {
  ArrowDown,
  ArrowUp,
  Calendar,
  MapPin,
  RefreshCcw,
  Thermometer,
} from "lucide-react";

export type SortKey = "date" | "city" | "temperature";
export type SortDir = "asc" | "desc";

type Props = {
  cityFilter: string;
  onCityFilterAction: (v: string) => void;

  sortKey: SortKey;
  onSortKeyAction: (v: SortKey) => void;

  sortDir: SortDir;
  onSortDirAction: (v: SortDir) => void;

  onRefreshAction: () => void;
  onCreatedAction: (allReports: WeatherReport[]) => void;
};

export default function ReportsToolbar({
  cityFilter,
  onCityFilterAction,
  sortKey,
  onSortKeyAction,
  sortDir,
  onSortDirAction,
  onRefreshAction,
  onCreatedAction,
}: Props) {
  return (
    <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-2">
        <AddReportDialog onCreatedAction={onCreatedAction} />
        <Button variant="outline" onClick={onRefreshAction}>
          <RefreshCcw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      <div className="grid w-full grid-cols-1 gap-2 sm:w-auto sm:grid-cols-3 justify-items-end">
        <Input
          placeholder="Filter by city"
          value={cityFilter}
          onChange={(e) => onCityFilterAction(e.target.value)}
        />

        <Select
          value={sortKey}
          onValueChange={(v) => onSortKeyAction(v as SortKey)}
        >
          <SelectTrigger aria-label="Filter by">
            <SelectValue placeholder="Filter by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Date</span>
              </div>
            </SelectItem>
            <SelectItem value="city">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>City</span>
              </div>
            </SelectItem>
            <SelectItem value="temperature">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4" />
                <span>Temperature (K)</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={sortDir}
          onValueChange={(v) => onSortDirAction(v as SortDir)}
        >
          <SelectTrigger aria-label="Sort direction">
            <SelectValue placeholder="Direction" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">
              <div className="flex items-center gap-2">
                <ArrowUp className="w-4 h-4" />
                <span>Ascending</span>
              </div>
            </SelectItem>
            <SelectItem value="desc">
              <div className="flex items-center gap-2">
                <ArrowDown className="w-4 h-4" />
                <span>Descending</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
