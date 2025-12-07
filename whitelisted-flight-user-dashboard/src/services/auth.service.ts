import { api, setAuthToken, setUserData, removeAuthToken } from "@/lib/api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface AuthResponse {
  token: string;
  expires_at: string;
  user: {
    id: string;
    email: string;
    name: string;
    phone?: string;
    role: string;
    created_at: string;
    updated_at: string;
  };
}

export const authService = {
  // Login
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", credentials);
    setAuthToken(response.token);
    setUserData(response.user);
    return response;
  },

  // Register
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/register", data);
    setAuthToken(response.token);
    setUserData(response.user);
    return response;
  },

  // Get current user
  async getCurrentUser() {
    return api.get("/auth/me", true);
  },

  // Logout
  logout() {
    removeAuthToken();
  },
};

