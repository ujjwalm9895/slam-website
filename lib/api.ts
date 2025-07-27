// Centralized API configuration
export const getApiBaseUrl = () => {
  // Use environment variable if set
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Use HTTP for localhost, HTTPS for production
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return "http://localhost:8000/api";
  }
  
  // Always use HTTPS in production
  return "https://api.klipsmart.shop/api";
};

// Export the API base URL for direct use
export const API_BASE_URL = getApiBaseUrl();

// Helper function to build API endpoints
export const buildApiUrl = (endpoint: string) => {
  return `${API_BASE_URL}/${endpoint}`;
}; 