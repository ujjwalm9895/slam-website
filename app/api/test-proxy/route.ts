import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('🧪 Testing proxy functionality...');
  
  try {
    // Test the production API directly
    const productionUrl = 'https://api.klipsmart.shop/health';
    console.log('🌍 Testing production API:', productionUrl);
    
    const response = await fetch(productionUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
    });
    
    console.log('✅ Production API response status:', response.status);
    console.log('🔗 Production API response URL:', response.url);
    
    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      productionStatus: response.status,
      productionUrl: response.url,
      data: data,
      message: 'Proxy test successful'
    });
  } catch (error) {
    console.error('❌ Proxy test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Proxy test failed'
    }, { status: 500 });
  }
} 