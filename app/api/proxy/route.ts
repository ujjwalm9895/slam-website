import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint');
  
  if (!endpoint) {
    return NextResponse.json({ error: 'Endpoint parameter is required' }, { status: 400 });
  }

  try {
    const productionUrl = `https://api.klipsmart.shop/api/${endpoint}`;
    console.log('🔄 Proxying request to:', productionUrl);
    
    const response = await fetch(productionUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      redirect: 'follow', // Allow redirects on server side
    });
    
    console.log('🔄 Proxy response status:', response.status);
    console.log('🔄 Proxy response URL:', response.url);
    console.log('🔄 Proxy response headers:', Object.fromEntries(response.headers.entries()));

    const data = await response.json();
    
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('❌ Proxy error:', error);
    return NextResponse.json({ error: 'Failed to fetch from production API' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint');
  
  if (!endpoint) {
    return NextResponse.json({ error: 'Endpoint parameter is required' }, { status: 400 });
  }

  try {
    const productionUrl = `https://api.klipsmart.shop/api/${endpoint}`;
    const body = await request.json();
    
    console.log('🔄 Proxying POST request to:', productionUrl);
    
    const response = await fetch(productionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      redirect: 'follow', // Allow redirects on server side
    });
    
    console.log('🔄 Proxy POST response status:', response.status);
    console.log('🔄 Proxy POST response URL:', response.url);

    const data = await response.json();
    
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('❌ Proxy error:', error);
    return NextResponse.json({ error: 'Failed to fetch from production API' }, { status: 500 });
  }
} 