import { api } from "@/lib/api";

export interface Airline {
  id: string;
  code: string;
  name: string;
  logo?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const airlineService = {
  // Get all airlines
  async getAllAirlines(): Promise<Airline[]> {
    return api.get("/airlines/all");
  },

  // Get airlines with pagination
  async getAirlines(page = 1, pageSize = 10, activeOnly = false) {
    return api.get(
      `/airlines?page=${page}&page_size=${pageSize}&active_only=${activeOnly}`
    );
  },

  // Get airline by ID
  async getAirlineById(id: string): Promise<Airline> {
    return api.get(`/airlines/${id}`);
  },

  // Create airline (admin)
  async createAirline(data: Partial<Airline>) {
    return api.post("/admin/airlines", data, true);
  },

  // Update airline (admin)
  async updateAirline(id: string, data: Partial<Airline>) {
    return api.put(`/admin/airlines/${id}`, data, true);
  },

  // Delete airline (admin)
  async deleteAirline(id: string) {
    return api.delete(`/admin/airlines/${id}`, true);
  },
};

