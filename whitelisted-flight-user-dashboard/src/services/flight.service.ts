import { api } from "@/lib/api";

export interface SearchFlightParams {
  origin: string;
  destination: string;
  departure_date: string;
  cabin_class?: string;
  airlines?: string;
  page?: number;
  page_size?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
}

export const flightService = {
  // Search flights
  async searchFlights(params: SearchFlightParams) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    return api.get(`/flights/search?${queryParams.toString()}`);
  },

  // Get flight detail
  async getFlightDetail(id: string) {
    return api.get(`/flights/${id}`);
  },

  // Get schedules by airline
  async getSchedulesByAirline(
    airlineId: string,
    page = 1,
    pageSize = 10
  ): Promise<PaginatedResponse<any>> {
    return api.get(
      `/airlines/${airlineId}/schedules?page=${page}&page_size=${pageSize}`
    );
  },
};

