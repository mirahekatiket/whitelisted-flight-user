/**
 * Utility to clean up corrupted localStorage data
 * Call this on app initialization if needed
 */

export function cleanupCorruptedStorage() {
  if (typeof window === "undefined") return;

  const keysToCheck = ["auth_token", "user_data"];

  keysToCheck.forEach((key) => {
    try {
      const value = localStorage.getItem(key);
      
      if (value === "undefined" || value === "null") {
        console.warn(`Removing corrupted localStorage key: ${key}`);
        localStorage.removeItem(key);
      }
      
      // For user_data, try to parse it
      if (key === "user_data" && value) {
        try {
          JSON.parse(value);
        } catch (error) {
          console.warn(`Removing invalid JSON in localStorage key: ${key}`);
          localStorage.removeItem(key);
        }
      }
    } catch (error) {
      console.error(`Error checking localStorage key: ${key}`, error);
    }
  });
}

/**
 * Clear all auth-related data
 */
export function clearAllAuthData() {
  if (typeof window === "undefined") return;
  
  localStorage.removeItem("auth_token");
  localStorage.removeItem("user_data");
  console.log("Cleared all authentication data");
}

