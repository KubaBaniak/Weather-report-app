"use client";

import api from "@/lib/api";
import { TemperatureUnit, WeatherReport } from "@/lib/types";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Pen } from "lucide-react";
import { toKelvin } from "@/lib/conversions";
import { toast } from "sonner";

export default function EditReportDialog({
  report,
  onEditAction,
}: {
  report: WeatherReport;
  onEditAction: (reports: WeatherReport[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [city, setCity] = useState(report.city);
  const [temperature, setTemperature] = useState(
    toKelvin(report.temperature, report.unit).toFixed(1),
  );
  const [unit, setUnit] = useState<string>("K");
  const [date, setDate] = useState<string>(report.date);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!city.trim()) return;
    const tempNum = Number(temperature);
    if (Number.isNaN(tempNum)) return;

    const payload = {
      city: city.trim(),
      temperature: tempNum,
      unit: unit as TemperatureUnit,
      date: date,
    };

    try {
      setSaving(true);
      const res = await api.put<WeatherReport[]>(
        `/reports/${report.id}`,
        payload,
      );
      const allReports = res?.data;
      onEditAction(allReports);
      setOpen(false);
      toast.success("Weather report edited successfully");
    } catch (e) {
      console.error(e);
      toast.error(
        "Weather report could not be edited. Please validate data and try again",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      aria-describedby="open-report-form"
    >
      <DialogTrigger asChild>
        <Button size="sm">
          <Pen />
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent aria-describedby="create-new-report">
        <DialogHeader>
          <DialogTitle>Edit weather report</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="e.g. Warsaw"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature</Label>
              <Input
                id="temperature"
                type="number"
                step="0.1"
                placeholder="e.g. 270"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Unit</Label>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="C">°C</SelectItem>
                  <SelectItem value="F">°F</SelectItem>
                  <SelectItem value="K">K</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
            >
              Anuluj
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
