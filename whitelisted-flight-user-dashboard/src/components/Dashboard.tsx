"use client";

import { useState } from "react";
import { WhitelistedEmail, EmailFormData } from "@/types";
import { airlines } from "@/data/airlines";
import { initialEmails } from "@/data/mockEmails";
import EmailTable from "./EmailTable";
import EmailModal from "./EmailModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import Sidebar from "./Sidebar";

export default function Dashboard() {
  const [emails, setEmails] = useState<WhitelistedEmail[]>(initialEmails);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmail, setEditingEmail] = useState<WhitelistedEmail | null>(
    null
  );
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    email: WhitelistedEmail | null;
  }>({ isOpen: false, email: null });
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEmails = emails.filter(
    (email) =>
      email.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddEmail = () => {
    setEditingEmail(null);
    setIsModalOpen(true);
  };

  const handleEditEmail = (email: WhitelistedEmail) => {
    setEditingEmail(email);
    setIsModalOpen(true);
  };

  const handleDeleteEmail = (id: string) => {
    const email = emails.find((e) => e.id === id);
    if (email) {
      setDeleteConfirm({ isOpen: true, email });
    }
  };

  const confirmDelete = () => {
    if (deleteConfirm.email) {
      setEmails((prev) => prev.filter((e) => e.id !== deleteConfirm.email!.id));
      setDeleteConfirm({ isOpen: false, email: null });
    }
  };

  const handleSaveEmail = (data: EmailFormData) => {
    if (editingEmail) {
      // Update existing email
      setEmails((prev) =>
        prev.map((email) =>
          email.id === editingEmail.id
            ? {
                ...email,
                ...data,
                updatedAt: new Date(),
              }
            : email
        )
      );
    } else {
      // Add new email
      const newEmail: WhitelistedEmail = {
        id: Date.now().toString(),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setEmails((prev) => [...prev, newEmail]);
    }
  };

  const handleToggleAirline = (emailId: string, airlineId: string) => {
    setEmails((prev) =>
      prev.map((email) => {
        if (email.id === emailId) {
          const isEnabled = email.enabledAirlines.includes(airlineId);
          return {
            ...email,
            enabledAirlines: isEnabled
              ? email.enabledAirlines.filter((id) => id !== airlineId)
              : [...email.enabledAirlines, airlineId],
            updatedAt: new Date(),
          };
        }
        return email;
      })
    );
  };

  const totalEnabledAirlines = emails.reduce(
    (acc, email) => acc + email.enabledAirlines.length,
    0
  );

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <Sidebar />

      {/* Main Content */}
      <div className="ml-64 transition-all duration-300">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Email Whitelist
            </h1>
            <p className="text-sm text-gray-500">
              Manage email access to airline services
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-full bg-[#0194f3] flex items-center justify-center text-white font-semibold text-sm">
              TT
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
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
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Emails</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {emails.length}
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Active Permissions</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {totalEnabledAirlines}
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
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Available Airlines</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {airlines.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search by email or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0194f3]/20 focus:border-[#0194f3] transition-all"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setSearchTerm("")}
                  className="px-4 py-2.5 rounded-lg border border-gray-300 text-[#0194f3] hover:bg-gray-50 transition-colors font-medium"
                >
                  Reset filter
                </button>
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
                  Add new email
                </button>
              </div>
            </div>
          </div>

          {/* Email Table */}
          <EmailTable
            emails={filteredEmails}
            airlines={airlines}
            onEdit={handleEditEmail}
            onDelete={handleDeleteEmail}
            onToggleAirline={handleToggleAirline}
          />

          {/* Airlines Legend */}
          <div className="mt-6 p-5 rounded-xl bg-white border border-gray-200">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              Available Airlines
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {airlines.map((airline) => (
                <div
                  key={airline.id}
                  className="flex items-center gap-2 p-2 rounded-lg bg-gray-50"
                >
                  <span className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                    {airline.code}
                  </span>
                  <span className="text-sm text-gray-600 truncate">
                    {airline.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <EmailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEmail}
        email={editingEmail}
        airlines={airlines}
      />

      <DeleteConfirmModal
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, email: null })}
        onConfirm={confirmDelete}
        emailName={deleteConfirm.email?.email || ""}
      />
    </div>
  );
}
