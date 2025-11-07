import { TemperatureUnit } from "./types";

export const toKelvin = (value: number, unit: TemperatureUnit) => {
  if (unit === "K") return value;
  if (unit === "C") return value + 273;

  return (value - 32) * (5 / 9) + 273;
};
