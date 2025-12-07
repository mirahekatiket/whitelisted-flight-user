"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBooking } from "@/context/BookingContext";
import { adminService } from "@/services/admin.service";
import { airlineService } from "@/services/airline.service";
import Sidebar from "./Sidebar";

interface Statistics {
  totalAirlines: number;
  totalSchedules: number;
  totalOrders: number;
}

interface Airline {
  id: string;
  code: string;
  name: string;
  is_active: boolean;
}

interface Schedule {
  id: string;
  flight_number: string;
  airline?: {
    code: string;
    name: string;
  };
  departure_airport?: {
    code: string;
    city: string;
  };
  arrival_airport?: {
    code: string;
    city: string;
  };
  departure_time: string;
  arrival_time: string;
  economy_price: number;
  is_active: boolean;
}

export default function Dashboard() {
  const router = useRouter();
  const { user, isLoggedIn } = useBooking();
  const [stats, setStats] = useState<Statistics>({
    totalAirlines: 0,
    totalSchedules: 0,
    totalOrders: 0,
  });
  const [airlines, setAirlines] = useState<Airline[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "airlines" | "schedules">("overview");

  // Check authentication
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    // Check if user is admin
    if (user?.role !== "admin") {
      router.push("/search");
      return;
    }
  }, [isLoggedIn, user, router]);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      if (!isLoggedIn || user?.role !== "admin") return;

      setIsLoading(true);
      try {
        const [statsData, airlinesData, schedulesData] = await Promise.all([
          adminService.getStatistics(),
          airlineService.getAllAirlines(),
          adminService.getSchedules(1, 10),
        ]);

        setStats(statsData);
        setAirlines(airlinesData || []);
        setSchedules(schedulesData?.data || []);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [isLoggedIn, user]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID").format(price);
  };

  const toggleAirlineStatus = async (airlineId: string, currentStatus: boolean) => {
    try {
      await adminService.updateAirline(airlineId, { is_active: !currentStatus });
      // Reload airlines
      const airlinesData = await airlineService.getAllAirlines();
      setAirlines(airlinesData || []);
    } catch (error) {
      console.error("Failed to toggle airline status:", error);
      alert("Failed to update airline status");
    }
  };

  if (!isLoggedIn || user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Access Denied</p>
          <p className="text-sm text-gray-500">Admin access required</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f7fa]">
        <Sidebar />
        <div className="ml-64 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#0194f3]"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <Sidebar />

      {/* Main Content */}
      <div className="ml-64 transition-all duration-300">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-500">
              Manage airlines, schedules, and orders
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.name}</span>
            <div className="w-9 h-9 rounded-full bg-[#0194f3] flex items-center justify-center text-white font-semibold text-sm">
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="bg-white border-b border-gray-200 px-6">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "overview"
                  ? "border-[#0194f3] text-[#0194f3]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("airlines")}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "airlines"
                  ? "border-[#0194f3] text-[#0194f3]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Airlines
            </button>
            <button
              onClick={() => setActiveTab("schedules")}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "schedules"
                  ? "border-[#0194f3] text-[#0194f3]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Flight Schedules
            </button>
          </div>
        </div>

        {/* Main Content */}
        <main className="p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                <div className="p-5 rounded-xl bg-white border border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-[#0194f3]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Airlines</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.totalAirlines}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-white border border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-lg bg-green-50 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Flight Schedules</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.totalSchedules}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-white border border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-lg bg-purple-50 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-purple-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Orders</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.totalOrders}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => setActiveTab("schedules")}
                    className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#0194f3] hover:bg-blue-50 transition-colors text-left"
                  >
                    <p className="font-medium text-gray-900">Add Flight Schedule</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Create a new flight schedule for an airline
                    </p>
                  </button>
                  <button
                    onClick={() => setActiveTab("airlines")}
                    className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#0194f3] hover:bg-blue-50 transition-colors text-left"
                  >
                    <p className="font-medium text-gray-900">Manage Airlines</p>
                    <p className="text-sm text-gray-500 mt-1">
                      View and manage airline status
                    </p>
                  </button>
                </div>
              </div>

              {/* Recent Schedules */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Recent Flight Schedules
                  </h3>
                  <button
                    onClick={() => setActiveTab("schedules")}
                    className="text-sm text-[#0194f3] hover:underline"
                  >
                    View all
                  </button>
                </div>
                {schedules.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    No flight schedules yet. Create your first schedule!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {schedules.slice(0, 5).map((schedule) => (
                      <div
                        key={schedule.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                            {schedule.airline?.code || "XX"}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {schedule.flight_number}
                            </p>
                            <p className="text-sm text-gray-500">
                              {schedule.departure_airport?.code} → {schedule.arrival_airport?.code}
                              {" • "}
                              {schedule.departure_time} - {schedule.arrival_time}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            IDR {formatPrice(schedule.economy_price)}
                          </p>
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                              schedule.is_active
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {schedule.is_active ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Airlines Tab */}
          {activeTab === "airlines" && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Airlines Management
                </h3>
                <p className="text-sm text-gray-500">
                  {airlines.length} airlines total
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {airlines.map((airline) => (
                  <div
                    key={airline.id}
                    className="p-4 border border-gray-200 rounded-lg hover:border-[#0194f3] transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                          {airline.code}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {airline.code}
                          </p>
                          <p className="text-xs text-gray-500">{airline.name}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleAirlineStatus(airline.id, airline.is_active)}
                        className={`relative w-11 h-6 rounded-full transition-colors ${
                          airline.is_active ? "bg-[#0194f3]" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                            airline.is_active ? "left-6" : "left-1"
                          }`}
                        />
                      </button>
                    </div>
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        airline.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {airline.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Schedules Tab */}
          {activeTab === "schedules" && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Flight Schedules
                </h3>
                <a
                  href="http://localhost:8080/swagger/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#0194f3] text-white rounded-lg hover:bg-[#0180d6] transition-colors text-sm font-medium"
                >
                  Add Schedule via Swagger
                </a>
              </div>
              {schedules.length === 0 ? (
                <div className="text-center py-12">
                  <svg
                    className="w-16 h-16 mx-auto text-gray-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <p className="text-gray-600 mb-2">No schedules created yet</p>
                  <p className="text-sm text-gray-500 mb-4">
                    Create your first flight schedule using the Swagger UI
                  </p>
                  <a
                    href="http://localhost:8080/swagger/index.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-6 py-2 bg-[#0194f3] text-white rounded-lg hover:bg-[#0180d6] transition-colors"
                  >
                    Open Swagger UI
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  {schedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className="flex items-center justify-between p-5 border border-gray-200 rounded-lg hover:border-[#0194f3] transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                          {schedule.airline?.code || "XX"}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <p className="font-semibold text-gray-900">
                              {schedule.airline?.name || "Unknown"}
                            </p>
                            <span className="text-sm text-gray-500">
                              {schedule.flight_number}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>
                              {schedule.departure_airport?.city} ({schedule.departure_airport?.code})
                            </span>
                            <span>→</span>
                            <span>
                              {schedule.arrival_airport?.city} ({schedule.arrival_airport?.code})
                            </span>
                            <span>•</span>
                            <span>
                              {schedule.departure_time} - {schedule.arrival_time}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          IDR {formatPrice(schedule.economy_price)}
                        </p>
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-medium mt-1 ${
                            schedule.is_active
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {schedule.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
