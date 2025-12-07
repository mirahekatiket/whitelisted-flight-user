import { api } from "@/lib/api";

export interface WhitelistedUser {
  id: string;
  email: string;
  name: string;
  enabled_airlines: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateWhitelistRequest {
  email: string;
  name: string;
  enabled_airlines: string[];
}

export interface UpdateWhitelistRequest {
  name?: string;
  enabled_airlines?: string[];
}

export interface PaginatedWhitelistResponse {
  success: boolean;
  data: WhitelistedUser[];
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
}

export const whitelistService = {
  // Get all whitelisted users with pagination
  async getWhitelistedUsers(
    page = 1,
    pageSize = 20
  ): Promise<PaginatedWhitelistResponse> {
    return api.getRaw(`/admin/whitelist?page=${page}&page_size=${pageSize}`, true);
  },

  // Get whitelisted user by ID
  async getWhitelistedUserById(id: string): Promise<WhitelistedUser> {
    return api.get(`/admin/whitelist/${id}`, true);
  },

  // Create whitelisted user
  async createWhitelistedUser(
    data: CreateWhitelistRequest
  ): Promise<WhitelistedUser> {
    return api.post("/admin/whitelist", data, true);
  },

  // Update whitelisted user
  async updateWhitelistedUser(
    id: string,
    data: UpdateWhitelistRequest
  ): Promise<WhitelistedUser> {
    return api.put(`/admin/whitelist/${id}`, data, true);
  },

  // Delete whitelisted user
  async deleteWhitelistedUser(id: string): Promise<void> {
    return api.delete(`/admin/whitelist/${id}`, true);
  },

  // Toggle airline access for a whitelisted user
  async toggleAirlineAccess(
    id: string,
    airlineId: string
  ): Promise<WhitelistedUser> {
    return api.post(
      `/admin/whitelist/${id}/toggle-airline`,
      { airline_id: airlineId },
      true
    );
  },

  // Check if email is whitelisted
  async checkEmailAccess(
    email: string,
    airlineId?: string
  ): Promise<{ whitelisted: boolean; has_access?: boolean }> {
    const query = airlineId
      ? `?email=${email}&airline_id=${airlineId}`
      : `?email=${email}`;
    return api.get(`/whitelist/check${query}`);
  },
};

