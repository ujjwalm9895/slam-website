"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

interface TestResult {
  endpoint: string;
  status: 'loading' | 'success' | 'error';
  data?: any;
  error?: string;
}

export default function APITestClient() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const endpoints = [
    { name: 'Health Check', url: 'http://localhost:8000/health' },
    { name: 'Farmers', url: `${API_BASE_URL}/farmers` },
    { name: 'Experts', url: `${API_BASE_URL}/experts` },
    { name: 'Products', url: `${API_BASE_URL}/products` },
    { name: 'Dealers', url: `${API_BASE_URL}/dealers` },
  ];

  const testEndpoint = async (endpoint: { name: string; url: string }) => {
    setTestResults(prev => 
      prev.map(result => 
        result.endpoint === endpoint.name 
          ? { ...result, status: 'loading' as const }
          : result
      )
    );

    try {
      const response = await fetch(endpoint.url);
      const data = await response.json();
      
      setTestResults(prev => 
        prev.map(result => 
          result.endpoint === endpoint.name 
            ? { 
                endpoint: endpoint.name, 
                status: 'success' as const, 
                data: data 
              }
            : result
        )
      );
    } catch (error) {
      setTestResults(prev => 
        prev.map(result => 
          result.endpoint === endpoint.name 
            ? { 
                endpoint: endpoint.name, 
                status: 'error' as const, 
                error: error instanceof Error ? error.message : 'Unknown error' 
              }
            : result
        )
      );
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    
    // Initialize all tests as loading
    setTestResults(endpoints.map(endpoint => ({
      endpoint: endpoint.name,
      status: 'loading' as const
    })));

    // Test each endpoint
    for (const endpoint of endpoints) {
      await testEndpoint(endpoint);
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setIsRunning(false);
  };

  useEffect(() => {
    runAllTests();
  }, []);

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'loading':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'loading':
        return 'border-blue-200 bg-blue-50';
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          FastAPI Backend Test
        </h1>
        <p className="text-gray-600 mb-6">
          Testing connection to your FastAPI backend at {API_BASE_URL}
        </p>
        <button
          onClick={runAllTests}
          disabled={isRunning}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 mx-auto"
        >
          <RefreshCw className={`w-5 h-5 ${isRunning ? 'animate-spin' : ''}`} />
          {isRunning ? 'Testing...' : 'Run Tests'}
        </button>
      </div>

      <div className="grid gap-4">
        {testResults.map((result) => (
          <Card key={result.endpoint} className={`border-2 ${getStatusColor(result.status)}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(result.status)}
                  <h3 className="text-lg font-semibold text-gray-900">
                    {result.endpoint}
                  </h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  result.status === 'success' ? 'bg-green-100 text-green-800' :
                  result.status === 'error' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {result.status.toUpperCase()}
                </span>
              </div>
              
              {result.status === 'success' && result.data && (
                <div className="mt-4 p-4 bg-white rounded-lg border">
                  <h4 className="font-medium text-gray-900 mb-2">Response Data:</h4>
                  <pre className="text-sm text-gray-600 overflow-x-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              )}
              
              {result.status === 'error' && result.error && (
                <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                  <h4 className="font-medium text-red-900 mb-2">Error:</h4>
                  <p className="text-sm text-red-700">{result.error}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Instructions:</h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>Make sure your FastAPI backend is running on <code className="bg-gray-200 px-2 py-1 rounded">https://localhost:8000</code></li>
          <li>Click "Run Tests" to test all API endpoints</li>
          <li>Green checkmarks indicate successful API calls</li>
          <li>Red X marks indicate connection errors</li>
          <li>Check the response data to verify the API structure</li>
        </ol>
      </div>
    </div>
  );
} 