"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { useBooking } from "@/context/BookingContext";

interface SidebarProps {
  collapsed?: boolean;
}

export default function Sidebar({ collapsed = false }: SidebarProps) {
  const router = useRouter();
  const { setUser } = useBooking();
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  const [currentPath, setCurrentPath] = useState("/dashboard");

  const handleNavigation = (path: string) => {
    setCurrentPath(path);
    router.push(path);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    router.push("/login");
  };

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      path: "/dashboard",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
      ),
    },
    {
      id: "search",
      label: "Search Flights",
      path: "/search",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      ),
    },
    {
      id: "swagger",
      label: "API Docs",
      external: true,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-40 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center gap-1">
            <span className="text-xl font-bold text-gray-900">tiket</span>
            <span className="w-2 h-2 rounded-full bg-[#ffc107]"></span>
            <span className="text-xl font-bold text-[#0194f3]">com</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
        >
          <svg
            className={`w-5 h-5 transition-transform ${isCollapsed ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Menu Items */}
      <nav className="p-3 space-y-1">
        {menuItems.map((item) => {
          if (item.external) {
            return (
              <a
                key={item.id}
                href="http://localhost:8080/swagger/index.html"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-gray-600 hover:bg-gray-100"
              >
                <span className="text-gray-400">{item.icon}</span>
                {!isCollapsed && <span className="font-medium text-sm">{item.label}</span>}
              </a>
            );
          }

          const isActive = currentPath === item.path;
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path!)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-50 text-[#0194f3] border-l-4 border-[#0194f3] -ml-px"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span className={isActive ? "text-[#0194f3]" : "text-gray-400"}>{item.icon}</span>
              {!isCollapsed && <span className="font-medium text-sm">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200 bg-white">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-red-600 hover:bg-red-50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          {!isCollapsed && <span className="font-medium text-sm">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
