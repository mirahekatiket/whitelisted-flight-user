"use client";

import { useState, useEffect } from "react";
import { WhitelistedEmail, EmailFormData, Airline } from "@/types";
import AirlineToggle from "./AirlineToggle";

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EmailFormData) => void;
  email?: WhitelistedEmail | null;
  airlines: Airline[];
}

export default function EmailModal({
  isOpen,
  onClose,
  onSave,
  email,
  airlines,
}: EmailModalProps) {
  const [formData, setFormData] = useState<EmailFormData>({
    email: "",
    name: "",
    enabledAirlines: [],
  });
  const [errors, setErrors] = useState<{ email?: string; name?: string }>({});

  useEffect(() => {
    if (email) {
      setFormData({
        email: email.email,
        name: email.name,
        enabledAirlines: [...email.enabledAirlines],
      });
    } else {
      setFormData({
        email: "",
        name: "",
        enabledAirlines: [],
      });
    }
    setErrors({});
  }, [email, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: { email?: string; name?: string } = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  const handleAirlineToggle = (airlineId: string) => {
    setFormData((prev) => ({
      ...prev,
      enabledAirlines: prev.enabledAirlines.includes(airlineId)
        ? prev.enabledAirlines.filter((id) => id !== airlineId)
        : [...prev.enabledAirlines, airlineId],
    }));
  };

  const handleSelectAll = () => {
    setFormData((prev) => ({
      ...prev,
      enabledAirlines: airlines.map((a) => a.id),
    }));
  };

  const handleDeselectAll = () => {
    setFormData((prev) => ({
      ...prev,
      enabledAirlines: [],
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/40 transition-opacity"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl transform rounded-xl bg-white shadow-xl transition-all animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {email ? "Edit Email" : "Add New Email"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-5">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className={`w-full px-4 py-2.5 rounded-lg bg-white border ${
                    errors.email ? "border-red-400" : "border-gray-300"
                  } text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0194f3]/20 focus:border-[#0194f3] transition-all`}
                  placeholder="user@example.com"
                />
                {errors.email && (
                  <p className="mt-1.5 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className={`w-full px-4 py-2.5 rounded-lg bg-white border ${
                    errors.name ? "border-red-400" : "border-gray-300"
                  } text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0194f3]/20 focus:border-[#0194f3] transition-all`}
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="mt-1.5 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              {/* Airlines Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Enabled Airlines
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      className="text-xs px-3 py-1.5 rounded-lg bg-blue-50 text-[#0194f3] hover:bg-blue-100 transition-colors font-medium"
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={handleDeselectAll}
                      className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors font-medium"
                    >
                      Deselect All
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                  {airlines.map((airline) => (
                    <AirlineToggle
                      key={airline.id}
                      airline={airline}
                      enabled={formData.enabledAirlines.includes(airline.id)}
                      onToggle={handleAirlineToggle}
                    />
                  ))}
                </div>
                <p className="mt-3 text-sm text-gray-500">
                  {formData.enabledAirlines.length} of {airlines.length}{" "}
                  airlines enabled
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-[#0194f3] text-white hover:bg-[#0180d6] transition-colors font-medium"
              >
                {email ? "Save Changes" : "Add Email"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
