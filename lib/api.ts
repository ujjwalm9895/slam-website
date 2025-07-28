// Centralized API configuration
export const getApiBaseUrl = () => {
  // Use environment variable if set
  if (process.env.NEXT_PUBLIC_API_URL) {
    console.log('Using NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Use HTTP for localhost, HTTPS for production
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    console.log('Using localhost API URL');
    return "http://localhost:8000/api";
  }
  
  // Always use HTTPS in production
  console.log('Using production API URL');
  return "https://api.klipsmart.shop/api";
};

// Ensure HTTPS is always used in production
export const getSecureApiBaseUrl = () => {
  const baseUrl = getApiBaseUrl();
  
  // If we're in production (not localhost) and the URL is HTTP, force HTTPS
  if (typeof window !== 'undefined' && 
      window.location.hostname !== 'localhost' && 
      baseUrl.startsWith('http://')) {
    console.log('Forcing HTTPS for production');
    return baseUrl.replace('http://', 'https://');
  }
  
  return baseUrl;
};

// Export the API base URL for direct use
export const API_BASE_URL = getSecureApiBaseUrl();

// Helper function to build API endpoints
export const buildApiUrl = (endpoint: string) => {
  const baseUrl = API_BASE_URL;
  
  // Runtime check to ensure HTTPS in production
  if (typeof window !== 'undefined' && 
      window.location.protocol === 'https:' && 
      baseUrl.startsWith('http://')) {
    console.warn('Mixed content detected! Forcing HTTPS for API calls.');
    return `${baseUrl.replace('http://', 'https://')}/${endpoint}`;
  }
  
  return `${baseUrl}/${endpoint}`;
};

// Secure fetch function that ensures HTTPS in production
export const secureFetch = async (endpoint: string, options?: RequestInit) => {
  const url = buildApiUrl(endpoint);
  
  // Final safety check for mixed content
  if (typeof window !== 'undefined' && 
      window.location.protocol === 'https:' && 
      url.startsWith('http://')) {
    console.error('Mixed content blocked! Attempting to use HTTPS instead.');
    const secureUrl = url.replace('http://', 'https://');
    return fetch(secureUrl, options);
  }
  
  return fetch(url, options);
}; 