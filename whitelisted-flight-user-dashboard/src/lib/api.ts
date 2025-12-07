const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

// Storage keys
const TOKEN_KEY = "auth_token";
const USER_KEY = "user_data";

// Get auth token from localStorage
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

// Set auth token to localStorage
export function setAuthToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

// Remove auth token
export function removeAuthToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

// Get user data
export function getUserData(): any {
  if (typeof window === "undefined") return null;
  
  try {
    const data = localStorage.getItem(USER_KEY);
    
    // Handle corrupted or invalid data
    if (!data || data === "undefined" || data === "null") {
      localStorage.removeItem(USER_KEY);
      return null;
    }
    
    return JSON.parse(data);
  } catch (error) {
    console.error("Error parsing user data from localStorage:", error);
    // Clear corrupted data
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

// Set user data
export function setUserData(user: any): void {
  if (typeof window === "undefined") return;
  
  // Don't store undefined or null
  if (!user) {
    localStorage.removeItem(USER_KEY);
    return;
  }
  
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error("Error storing user data in localStorage:", error);
  }
}

interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
}

// Generic API fetch wrapper
export async function apiFetch<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { requireAuth = false, headers = {}, ...restOptions } = options;

  const config: RequestInit = {
    ...restOptions,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  // Always add Authorization header if token exists (for OptionalAuth endpoints)
  const token = getAuthToken();
  if (token) {
    (config.headers as Record<string, string>)["Authorization"] =
      `Bearer ${token}`;
  }

  const url = `${API_URL}${endpoint}`;

  try {
    const response = await fetch(url, config);

    // Handle non-JSON responses
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Server returned non-JSON response");
    }

    const data = await response.json();

    // Handle error responses
    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    // Return the data property if it exists (for successful responses)
    return data.data !== undefined ? data.data : data;
  } catch (error) {
    console.error("API fetch error:", error);
    throw error;
  }
}

// Raw API fetch for paginated responses (doesn't unwrap data)
export async function apiRawFetch<T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { requireAuth = false, headers = {}, ...restOptions } = options;

  const config: RequestInit = {
    ...restOptions,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  // Always add Authorization header if token exists (for OptionalAuth endpoints)
  const token = getAuthToken();
  if (token) {
    (config.headers as Record<string, string>)["Authorization"] =
      `Bearer ${token}`;
  }

  const url = `${API_URL}${endpoint}`;

  try {
    const response = await fetch(url, config);

    // Handle non-JSON responses
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Server returned non-JSON response");
    }

    const data = await response.json();

    // Handle error responses
    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    // Return the full response (for paginated responses)
    return data;
  } catch (error) {
    console.error("API fetch error:", error);
    throw error;
  }
}

// API methods
export const api = {
  get: <T = any>(endpoint: string, requireAuth = false) =>
    apiFetch<T>(endpoint, { method: "GET", requireAuth }),

  getRaw: <T = any>(endpoint: string, requireAuth = false) =>
    apiRawFetch<T>(endpoint, { method: "GET", requireAuth }),

  post: <T = any>(endpoint: string, body?: any, requireAuth = false) =>
    apiFetch<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
      requireAuth,
    }),

  put: <T = any>(endpoint: string, body?: any, requireAuth = false) =>
    apiFetch<T>(endpoint, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
      requireAuth,
    }),

  delete: <T = any>(endpoint: string, requireAuth = false) =>
    apiFetch<T>(endpoint, { method: "DELETE", requireAuth }),
};

