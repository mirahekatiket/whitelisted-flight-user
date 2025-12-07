import { api } from "@/lib/api";

export interface Airport {
  id: string;
  code: string;
  city: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export const airportService = {
  // Get all airports
  async getAllAirports(): Promise<Airport[]> {
    return api.get("/airports/all");
  },

  // Get airports with pagination
  async getAirports(page = 1, pageSize = 20) {
    return api.get(`/airports?page=${page}&page_size=${pageSize}`);
  },

  // Search airports
  async searchAirports(query: string): Promise<Airport[]> {
    return api.get(`/airports/search?q=${encodeURIComponent(query)}`);
  },

  // Get airport by ID
  async getAirportById(id: string): Promise<Airport> {
    return api.get(`/airports/${id}`);
  },

  // Get airport by code
  async getAirportByCode(code: string): Promise<Airport> {
    return api.get(`/airports/code/${code}`);
  },
};

