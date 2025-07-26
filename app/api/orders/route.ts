import { NextRequest, NextResponse } from "next/server";

// Mock database - replace with real database
let orders = [
  {
    id: 1,
    customerName: "Rahul Singh",
    customerEmail: "rahul@example.com",
    customerPhone: "+91-98765-43213",
    farmerId: 1,
    farmerName: "Rajesh Patel",
    items: [
      { name: "Organic Tomatoes", quantity: 2, price: 80, unit: "kg" },
      { name: "Fresh Milk", quantity: 1, price: 60, unit: "liter" }
    ],
    totalAmount: 220,
    status: "confirmed",
    orderDate: "2025-01-26",
    deliveryDate: "2025-01-28",
    deliveryAddress: "Mumbai, Maharashtra",
    paymentStatus: "paid",
    orderType: "regular"
  },
  {
    id: 2,
    customerName: "Priya Gupta",
    customerEmail: "priya@example.com",
    customerPhone: "+91-98765-43214",
    farmerId: 2,
    farmerName: "Priya Sharma",
    items: [
      { name: "Fresh Mangoes", quantity: 3, price: 120, unit: "kg" }
    ],
    totalAmount: 360,
    status: "delivered",
    orderDate: "2025-01-25",
    deliveryDate: "2025-01-27",
    deliveryAddress: "Pune, Maharashtra",
    paymentStatus: "paid",
    orderType: "regular"
  }
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const customerEmail = searchParams.get('customerEmail');
    const status = searchParams.get('status');

    let filteredOrders = [...orders];

    // Filter by customer email
    if (customerEmail) {
      filteredOrders = filteredOrders.filter(order => 
        order.customerEmail === customerEmail
      );
    }

    // Filter by status
    if (status) {
      filteredOrders = filteredOrders.filter(order => 
        order.status === status
      );
    }

    return NextResponse.json({ 
      success: true, 
      orders: filteredOrders 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: "Failed to fetch orders" 
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      customerName, 
      customerEmail, 
      customerPhone, 
      farmerId, 
      items, 
      deliveryAddress, 
      orderType = "regular" 
    } = body;

    // Validate required fields
    if (!customerName || !customerEmail || !customerPhone || !farmerId || !items || !deliveryAddress) {
      return NextResponse.json({ 
        success: false, 
        error: "Missing required fields" 
      }, { status: 400 });
    }

    // Calculate total amount
    const totalAmount = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

    // Get farmer name (in real app, fetch from database)
    const farmerName = "Farmer Name"; // This would be fetched from farmers table

    // Create new order
    const newOrder = {
      id: orders.length + 1,
      customerName,
      customerEmail,
      customerPhone,
      farmerId,
      farmerName,
      items,
      totalAmount,
      status: "pending",
      orderDate: new Date().toISOString().split('T')[0],
      deliveryDate: "", // Changed from null to empty string
      deliveryAddress,
      paymentStatus: "pending",
      orderType
    };

    orders.push(newOrder);

    return NextResponse.json({ 
      success: true, 
      order: newOrder 
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: "Failed to create order" 
    }, { status: 500 });
  }
} 