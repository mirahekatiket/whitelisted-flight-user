"use client";

import { Airline } from "@/types";

interface AirlineToggleProps {
  airline: Airline;
  enabled: boolean;
  onToggle: (airlineId: string) => void;
  disabled?: boolean;
}

export default function AirlineToggle({
  airline,
  enabled,
  onToggle,
  disabled = false,
}: AirlineToggleProps) {
  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
        enabled
          ? "bg-blue-50 border-[#0194f3]"
          : "bg-white border-gray-200 hover:border-gray-300"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center font-semibold text-xs ${
            enabled
              ? "bg-[#0194f3] text-white"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {airline.code}
        </div>
        <span
          className={`font-medium text-sm ${enabled ? "text-gray-900" : "text-gray-600"}`}
        >
          {airline.name}
        </span>
      </div>
      <button
        type="button"
        onClick={() => !disabled && onToggle(airline.id)}
        disabled={disabled}
        className={`relative w-11 h-6 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0194f3] ${
          enabled ? "bg-[#0194f3]" : "bg-gray-200"
        } ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span
          className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}
