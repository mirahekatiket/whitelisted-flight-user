"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBooking } from "@/context/BookingContext";
import { whitelistService, WhitelistedUser } from "@/services/whitelist.service";
import { airlineService, Airline } from "@/services/airline.service";
import { adminService } from "@/services/admin.service";
import EmailModal from "./EmailModal";
import EmailTable from "./EmailTable";
import Sidebar from "./Sidebar";
import { EmailFormData, WhitelistedEmail } from "@/types";

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

export default function CombinedDashboard() {
  const router = useRouter();
  const { user, isLoggedIn, setUser } = useBooking();
  const [activeTab, setActiveTab] = useState<"whitelist" | "airlines" | "schedules" | "orders" | "airlines-prod" | "schedules-prod">("whitelist");
  
  // Whitelist state
  const [whitelistedUsers, setWhitelistedUsers] = useState<WhitelistedEmail[]>([]);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [editingEmail, setEditingEmail] = useState<WhitelistedEmail | null>(null);
  
  // Airlines state
  const [airlines, setAirlines] = useState<Airline[]>([]);
  
  // Schedules state
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  
  // Orders state
  const [orders, setOrders] = useState<any[]>([]);
  
  // Pagination states
  const [whitelistPage, setWhitelistPage] = useState(1);
  const [whitelistTotalPages, setWhitelistTotalPages] = useState(1);
  const [schedulePage, setSchedulePage] = useState(1);
  const [scheduleTotalPages, setScheduleTotalPages] = useState(1);
  const [orderPage, setOrderPage] = useState(1);
  const [orderTotalPages, setOrderTotalPages] = useState(1);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check authentication
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    if (user?.role !== "admin") {
      router.push("/search");
      return;
    }
  }, [isLoggedIn, user, router]);

  // Load data based on active tab
  useEffect(() => {
    loadData();
  }, [activeTab, whitelistPage, schedulePage, orderPage]);

  // Load airlines (needed for whitelist)
  useEffect(() => {
    loadAirlines();
  }, []);

  const loadAirlines = async () => {
    try {
      const data = await airlineService.getAllAirlines();
      setAirlines(data || []);
    } catch (err: any) {
      console.error("Failed to load airlines:", err);
    }
  };

  const loadData = async () => {
    if (!isLoggedIn || user?.role !== "admin") return;

    setIsLoading(true);
    setError(null);
    try {
      if (activeTab === "whitelist") {
        const res = await whitelistService.getWhitelistedUsers(whitelistPage);
        // Convert backend format to frontend format
        const convertedUsers: WhitelistedEmail[] = (res.data || []).map((user) => ({
          id: user.id,
          email: user.email,
          name: user.name,
          enabledAirlines: user.enabled_airlines || [],
          createdAt: new Date(user.created_at),
          updatedAt: new Date(user.updated_at),
        }));
        setWhitelistedUsers(convertedUsers);
        setWhitelistTotalPages(res.total_pages || 1);
      } else if (activeTab === "airlines" || activeTab === "airlines-prod") {
        const env = activeTab === "airlines-prod" ? "production" : "staging";
        const data = await adminService.getAirlines(env);
        setAirlines(data || []);
      } else if (activeTab === "schedules" || activeTab === "schedules-prod") {
        const env = activeTab === "schedules-prod" ? "production" : "staging";
        const res = await adminService.getSchedules(schedulePage, 20, env);
        setSchedules(res?.data || []);
        setScheduleTotalPages(res?.total_pages || 1);
      } else if (activeTab === "orders") {
        const res = await adminService.getAllOrders(orderPage);
        setOrders(res?.data || []);
        setOrderTotalPages(res?.total_pages || 1);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  };

  // Whitelist handlers
  const handleAddEmail = () => {
    setEditingEmail(null);
    setIsEmailModalOpen(true);
  };

  const handleEditEmail = (email: WhitelistedEmail) => {
    setEditingEmail(email);
    setIsEmailModalOpen(true);
  };

  const handleSaveEmail = async (formData: EmailFormData) => {
    try {
      if (editingEmail) {
        await whitelistService.updateWhitelistedUser(editingEmail.id, {
          name: formData.name,
          enabled_airlines: formData.enabledAirlines,
        });
      } else {
        await whitelistService.createWhitelistedUser({
          email: formData.email,
          name: formData.name,
          enabled_airlines: formData.enabledAirlines,
        });
      }
      setIsEmailModalOpen(false);
      loadData();
    } catch (err: any) {
      setError(err.message || "Failed to save whitelisted user");
    }
  };

  const handleDeleteEmail = async (id: string) => {
    if (window.confirm("Are you sure you want to remove this email from the whitelist?")) {
      try {
        await whitelistService.deleteWhitelistedUser(id);
        loadData();
      } catch (err: any) {
        setError(err.message || "Failed to delete whitelisted user");
      }
    }
  };

  const handleToggleAirline = async (emailId: string, airlineId: string) => {
    try {
      await whitelistService.toggleAirlineAccess(emailId, airlineId);
      loadData();
    } catch (err: any) {
      setError(err.message || "Failed to toggle airline access");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID").format(price);
  };

  if (isLoading && airlines.length === 0) return <div className="text-center py-8">Loading...</div>;
  if (!isLoggedIn || user?.role !== "admin") return null;

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as "whitelist" | "airlines" | "schedules" | "orders");
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa] flex">
      {/* Custom Sidebar for Dashboard */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-40">
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <div className="flex items-center gap-1">
            <span className="text-xl font-bold text-gray-900">tiket</span>
            <span className="w-2 h-2 rounded-full bg-[#ffc107]"></span>
            <span className="text-xl font-bold text-[#0194f3]">com</span>
          </div>
        </div>

        <nav className="p-3 space-y-1">
          {[
            { id: "whitelist", label: "Email Whitelist", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
            { id: "airlines", label: "Airlines", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
            { id: "airlines-prod", label: "Airlines", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", badge: "PROD" },
            { id: "schedules", label: "Schedules", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
            { id: "schedules-prod", label: "Schedules", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", badge: "PROD" },
            { id: "orders", label: "Orders", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg transition-colors ${
                activeTab === item.id
                  ? "bg-blue-50 text-[#0194f3]"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              <span className="font-medium text-sm flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className="px-1.5 py-0.5 text-xs font-semibold bg-orange-500 text-white rounded">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
          
          {/* <button
            onClick={() => router.push("/search")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-gray-600 hover:bg-gray-100"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="font-medium text-sm">Search Flights</span>
          </button> */}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200 bg-white">
          <button
            onClick={() => {
              setUser(null);
              router.push("/login");
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-red-600 hover:bg-red-50"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-64 transition-all duration-300 flex-1">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {activeTab === "whitelist" && "Email Whitelist Management"}
              {activeTab === "airlines" && "Airline Management (Staging)"}
              {activeTab === "airlines-prod" && "Airline Management (Production)"}
              {activeTab === "schedules" && "Flight Schedule Management (Staging)"}
              {activeTab === "schedules-prod" && "Flight Schedule Management (Production)"}
              {activeTab === "orders" && "Order Management"}
            </h1>
            <p className="text-sm text-gray-500">
              {activeTab === "whitelist" && "Manage email whitelist for the flight service"}
              {(activeTab === "airlines" || activeTab === "airlines-prod") && `Manage airlines in ${activeTab === "airlines-prod" ? "production" : "staging"} environment`}
              {(activeTab === "schedules" || activeTab === "schedules-prod") && `Manage flight schedules in ${activeTab === "schedules-prod" ? "production" : "staging"} environment`}
              {activeTab === "orders" && "Manage customer orders"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-full bg-[#0194f3] flex items-center justify-center text-white font-semibold text-sm">
              {user?.name ? user.name.substring(0, 2).toUpperCase() : "AD"}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
              <button
                onClick={() => setError(null)}
                className="ml-4 text-sm underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end mb-6">
            {activeTab === "whitelist" && (
              <button
                onClick={handleAddEmail}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#0194f3] text-white hover:bg-[#0180d6] transition-colors font-medium"
              >
                <svg
                  className="w-5 h-5"
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
                Add Email to Whitelist
              </button>
            )}
          </div>

          {/* Whitelist Tab */}
          {activeTab === "whitelist" && (
            <EmailTable
              emails={whitelistedUsers}
              airlines={airlines}
              onEdit={handleEditEmail}
              onDelete={handleDeleteEmail}
              onToggleAirline={handleToggleAirline}
            />
          )}

          {/* Airlines Tab (Staging & Production) */}
          {(activeTab === "airlines" || activeTab === "airlines-prod") && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Active
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {airlines.map((airline) => (
                    <tr key={airline.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {airline.code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {airline.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {airline.is_active ? "Yes" : "No"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Schedules Tab (Staging & Production) */}
          {(activeTab === "schedules" || activeTab === "schedules-prod") && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Flight No.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Route
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {schedules.map((schedule) => (
                    <tr key={schedule.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {schedule.flight_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {schedule.departure_airport?.code} → {schedule.arrival_airport?.code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {schedule.departure_time} - {schedule.arrival_time}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Rp {formatPrice(schedule.economy_price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.id.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.contact_email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Rp {formatPrice(order.total_amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {/* Email Modal */}
      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        onSave={handleSaveEmail}
        email={editingEmail}
        airlines={airlines}
      />
    </div>
  );
}

