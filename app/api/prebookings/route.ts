import { NextRequest, NextResponse } from "next/server";

// Mock database - replace with real database
let preBookings = [
  {
    id: 1,
    customerName: "Anita Desai",
    customerEmail: "anita@example.com",
    customerPhone: "+91-98765-43215",
    cropName: "Organic Tomatoes",
    quantity: 10,
    unit: "kg",
    preferredLocation: "Mumbai",
    expectedHarvestDate: "2025-03-15",
    status: "confirmed",
    farmerId: 1,
    farmerName: "Rajesh Patel",
    bookingFee: 500,
    totalAmount: 1300,
    requestDate: "2025-01-20",
    specialRequirements: "No pesticides, organic soil only"
  },
  {
    id: 2,
    customerName: "Vikram Mehta",
    customerEmail: "vikram@example.com",
    customerPhone: "+91-98765-43216",
    cropName: "Fresh Herbs",
    quantity: 5,
    unit: "kg",
    preferredLocation: "Pune",
    expectedHarvestDate: "2025-02-28",
    status: "pending",
    farmerId: 2,
    farmerName: "Priya Sharma",
    bookingFee: 300,
    totalAmount: 800,
    requestDate: "2025-01-25",
    specialRequirements: "Mixed herbs variety"
  }
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const customerEmail = searchParams.get('customerEmail');
    const status = searchParams.get('status');

    let filteredPreBookings = [...preBookings];

    // Filter by customer email
    if (customerEmail) {
      filteredPreBookings = filteredPreBookings.filter(booking => 
        booking.customerEmail === customerEmail
      );
    }

    // Filter by status
    if (status) {
      filteredPreBookings = filteredPreBookings.filter(booking => 
        booking.status === status
      );
    }

    return NextResponse.json({ 
      success: true, 
      preBookings: filteredPreBookings 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: "Failed to fetch pre-bookings" 
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
      cropName, 
      quantity, 
      unit, 
      preferredLocation, 
      expectedHarvestDate,
      specialRequirements = "",
      farmerId 
    } = body;

    // Validate required fields
    if (!customerName || !customerEmail || !customerPhone || !cropName || !quantity || !preferredLocation) {
      return NextResponse.json({ 
        success: false, 
        error: "Missing required fields" 
      }, { status: 400 });
    }

    // Calculate booking fee and total (in real app, this would be based on crop type and quantity)
    const bookingFee = Math.max(200, quantity * 30);
    const totalAmount = bookingFee + (quantity * 80); // Base price per unit

    // Get farmer name (in real app, fetch from database)
    const farmerName = "Farmer Name"; // This would be fetched from farmers table

    // Create new pre-booking
    const newPreBooking = {
      id: preBookings.length + 1,
      customerName,
      customerEmail,
      customerPhone,
      cropName,
      quantity,
      unit: unit || "kg",
      preferredLocation,
      expectedHarvestDate: expectedHarvestDate || null,
      status: "pending",
      farmerId: farmerId || null,
      farmerName,
      bookingFee,
      totalAmount,
      requestDate: new Date().toISOString().split('T')[0],
      specialRequirements
    };

    preBookings.push(newPreBooking);

    return NextResponse.json({ 
      success: true, 
      preBooking: newPreBooking 
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: "Failed to create pre-booking" 
    }, { status: 500 });
  }
} 