import { api } from "@/lib/api";

// Admin service for managing airlines, schedules, and orders
export const adminService = {
  // Get all airlines
  async getAirlines(env: 'staging' | 'production' = 'staging') {
    return api.get(`/airlines/all?env=${env}`, true);
  },

  // Get all schedules with pagination
  async getSchedules(page = 1, pageSize = 20, env: 'staging' | 'production' = 'staging') {
    return api.get(`/admin/schedules?page=${page}&page_size=${pageSize}&env=${env}`, true);
  },

  // Get all orders
  async getAllOrders(page = 1, pageSize = 20) {
    return api.get(`/admin/orders?page=${page}&page_size=${pageSize}`, true);
  },

  // Get statistics
  async getStatistics() {
    try {
      const [airlines, schedules, orders] = await Promise.all([
        api.get("/airlines/all", true),
        api.get("/admin/schedules?page=1&page_size=1", true),
        api.get("/admin/orders?page=1&page_size=1", true),
      ]);

      return {
        totalAirlines: Array.isArray(airlines) ? airlines.length : 0,
        totalSchedules: schedules?.total_items || 0,
        totalOrders: orders?.total_items || 0,
      };
    } catch (error) {
      console.error("Failed to fetch statistics:", error);
      return {
        totalAirlines: 0,
        totalSchedules: 0,
        totalOrders: 0,
      };
    }
  },

  // Create schedule
  async createSchedule(data: any, env: 'staging' | 'production' = 'staging') {
    return api.post(`/admin/schedules?env=${env}`, data, true);
  },

  // Update schedule
  async updateSchedule(id: string, data: any, env: 'staging' | 'production' = 'staging') {
    return api.put(`/admin/schedules/${id}?env=${env}`, data, true);
  },

  // Delete schedule
  async deleteSchedule(id: string, env: 'staging' | 'production' = 'staging') {
    return api.delete(`/admin/schedules/${id}?env=${env}`, true);
  },

  // Update airline
  async updateAirline(id: string, data: any, env: 'staging' | 'production' = 'staging') {
    return api.put(`/admin/airlines/${id}?env=${env}`, data, true);
  },

  // Create airline
  async createAirline(data: any, env: 'staging' | 'production' = 'staging') {
    return api.post(`/admin/airlines?env=${env}`, data, true);
  },

  // Delete airline
  async deleteAirline(id: string, env: 'staging' | 'production' = 'staging') {
    return api.delete(`/admin/airlines/${id}?env=${env}`, true);
  },
};

