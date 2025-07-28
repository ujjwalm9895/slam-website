// Centralized API configuration
export const getApiBaseUrl = () => {
  console.log('🔍 getApiBaseUrl() called');
  console.log('📍 Current hostname:', typeof window !== 'undefined' ? window.location.hostname : 'server-side');
  console.log('🔧 NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
  console.log('🌐 Window location:', typeof window !== 'undefined' ? window.location.href : 'N/A');
  
  // Always use HTTPS for production API
  console.log('🌍 Using production API URL: https://api.klipsmart.shop/api');
  return "https://api.klipsmart.shop/api";
};

// Ensure HTTPS is always used in production
export const getSecureApiBaseUrl = () => {
  console.log('🔒 getSecureApiBaseUrl() called');
  const baseUrl = getApiBaseUrl();
  console.log('📡 Base URL from getApiBaseUrl():', baseUrl);
  
  // If we're in production (not localhost) and the URL is HTTP, force HTTPS
  if (typeof window !== 'undefined' && 
      window.location.hostname !== 'localhost' && 
      baseUrl.startsWith('http://')) {
    console.log('⚠️ Forcing HTTPS for production');
    const secureUrl = baseUrl.replace('http://', 'https://');
    console.log('🔐 Converted to HTTPS:', secureUrl);
    return secureUrl;
  }
  
  console.log('✅ Using original base URL:', baseUrl);
  return baseUrl;
};

// Export the API base URL for direct use
export const API_BASE_URL = getSecureApiBaseUrl();
console.log('🚀 Final API_BASE_URL:', API_BASE_URL);

// Helper function to build API endpoints
export const buildApiUrl = (endpoint: string) => {
  console.log('🔗 buildApiUrl() called with endpoint:', endpoint);
  const baseUrl = API_BASE_URL;
  console.log('📡 Using base URL:', baseUrl);
  
  // Runtime check to ensure HTTPS in production
  if (typeof window !== 'undefined' && 
      window.location.protocol === 'https:' && 
      baseUrl.startsWith('http://')) {
    console.warn('⚠️ Mixed content detected! Forcing HTTPS for API calls.');
    const secureUrl = `${baseUrl.replace('http://', 'https://')}/${endpoint}`;
    console.log('🔐 Converted to secure URL:', secureUrl);
    return secureUrl;
  }
  
  const finalUrl = `${baseUrl}/${endpoint}`;
  console.log('✅ Final API URL:', finalUrl);
  return finalUrl;
};

// Smart fetch function that tries production first, then falls back to localhost
export const secureFetch = async (endpoint: string, options?: RequestInit): Promise<Response> => {
  console.log('🛡️ secureFetch() called with endpoint:', endpoint);
  console.log('🔧 Request options:', options);
  
  // In development, try proxy first to avoid CORS issues
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    console.log('🔄 Trying proxy API first (development)...');
    const proxyUrl = `/api/proxy?endpoint=${encodeURIComponent(endpoint)}`;
    console.log('🔗 Proxy URL:', proxyUrl);
    
    try {
      const proxyResponse = await fetch(proxyUrl, options);
      console.log('✅ Proxy API response status:', proxyResponse.status);
      console.log('🔗 Proxy API response URL:', proxyResponse.url);
      
      if (proxyResponse.ok) {
        console.log('✅ Proxy API call successful');
        return proxyResponse;
      } else {
        console.log('⚠️ Proxy API failed with status:', proxyResponse.status);
        throw new Error(`Proxy API failed: ${proxyResponse.status}`);
      }
    } catch (proxyError) {
      console.log('❌ Proxy API failed:', proxyError);
      console.log('🔍 Proxy error details:', proxyError instanceof Error ? proxyError.message : String(proxyError));
    }
  }
  
  // Try production API with HTTPS
  const productionUrl = `https://api.klipsmart.shop/api/${endpoint}`;
  console.log('🌍 Trying production API:', productionUrl);
  
  try {
    // Add CORS headers and allow redirects
    const fetchOptions = {
      ...options,
      mode: 'cors' as RequestMode,
      credentials: 'omit' as RequestCredentials,
      redirect: 'follow' as RequestRedirect, // Allow redirects
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options?.headers,
      },
    };
    
    const productionResponse = await fetch(productionUrl, fetchOptions);
    console.log('✅ Production API response status:', productionResponse.status);
    console.log('🔗 Production API response URL:', productionResponse.url);
    
    if (productionResponse.ok) {
      console.log('✅ Production API call successful');
      return productionResponse;
    } else {
      console.log('⚠️ Production API failed with status:', productionResponse.status);
      throw new Error(`Production API failed: ${productionResponse.status}`);
    }
  } catch (productionError) {
    console.log('❌ Production API failed:', productionError);
    console.log('🔍 Error details:', productionError instanceof Error ? productionError.message : String(productionError));
    
    // Try proxy if we're in development
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      console.log('🔄 Trying proxy API...');
      const proxyUrl = `/api/proxy?endpoint=${encodeURIComponent(endpoint)}`;
      console.log('🔗 Proxy URL:', proxyUrl);
      
      try {
        const proxyResponse = await fetch(proxyUrl, options);
        console.log('✅ Proxy API response status:', proxyResponse.status);
        console.log('🔗 Proxy API response URL:', proxyResponse.url);
        
        if (proxyResponse.ok) {
          console.log('✅ Proxy API call successful');
          return proxyResponse;
        } else {
          console.log('⚠️ Proxy API failed with status:', proxyResponse.status);
          throw new Error(`Proxy API failed: ${proxyResponse.status}`);
        }
      } catch (proxyError) {
        console.log('❌ Proxy API failed:', proxyError);
        console.log('🔍 Proxy error details:', proxyError instanceof Error ? proxyError.message : String(proxyError));
      }
    }
    
    // If we get here, all attempts failed
    console.error('❌ All API attempts failed');
    throw productionError;
  }
};

// Debug function to test API configuration
export const debugApiConfig = () => {
  console.log('🔍 === API CONFIGURATION DEBUG ===');
  console.log('📍 Current hostname:', typeof window !== 'undefined' ? window.location.hostname : 'server-side');
  console.log('🌐 Current protocol:', typeof window !== 'undefined' ? window.location.protocol : 'N/A');
  console.log('🔧 NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
  console.log('📡 API_BASE_URL:', API_BASE_URL);
  console.log('🌍 Production API URL: https://api.klipsmart.shop/api');
  console.log('🏠 Fallback localhost URL: http://localhost:8000/api');
  console.log('🔗 Sample production URL (farmers): https://api.klipsmart.shop/api/farmers');
  console.log('🔗 Sample localhost URL (farmers): http://localhost:8000/api/farmers');
  console.log('🔍 === END DEBUG ===');
};

// Test function to verify API connectivity
export const testApiConnectivity = async () => {
  console.log('🧪 === TESTING API CONNECTIVITY ===');
  
  try {
    console.log('🌍 Testing production API (HTTPS)...');
    const productionResponse = await fetch('https://api.klipsmart.shop/health', {
      mode: 'cors',
      credentials: 'omit',
      redirect: 'follow', // Allow redirects
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    console.log('✅ Production API status:', productionResponse.status);
    console.log('🔗 Production API response URL:', productionResponse.url);
    
    if (productionResponse.ok) {
      console.log('✅ Production API is working!');
      return 'production';
    } else {
      console.log('⚠️ Production API failed with status:', productionResponse.status);
    }
  } catch (error) {
    console.log('❌ Production API error:', error);
  }
  
  // Test proxy if we're in development
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    try {
      console.log('🔄 Testing proxy API...');
      const proxyResponse = await fetch('/api/proxy?endpoint=health');
      console.log('✅ Proxy API status:', proxyResponse.status);
      
      if (proxyResponse.ok) {
        console.log('✅ Proxy API is working!');
        return 'proxy';
      } else {
        console.log('⚠️ Proxy API failed with status:', proxyResponse.status);
      }
    } catch (error) {
      console.log('❌ Proxy API error:', error);
    }
  }
  
  // Test localhost if we're in development
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    try {
      console.log('🏠 Testing localhost API...');
      const localhostResponse = await fetch('http://localhost:8000/health');
      console.log('✅ Localhost API status:', localhostResponse.status);
      
      if (localhostResponse.ok) {
        console.log('✅ Localhost API is working!');
        return 'localhost';
      } else {
        console.log('⚠️ Localhost API failed with status:', localhostResponse.status);
      }
    } catch (error) {
      console.log('❌ Localhost API error:', error);
    }
  }
  
  console.log('❌ No APIs are working');
  return 'none';
}; 