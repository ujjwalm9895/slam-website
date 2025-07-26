import { NextRequest, NextResponse } from "next/server";

// Mock database - replace with real database
let ratings = [
  {
    id: 1,
    farmerId: 1,
    farmerName: "Rajesh Patel",
    customerName: "Rahul Singh",
    customerEmail: "rahul@example.com",
    rating: 5,
    review: "Excellent organic tomatoes! Very fresh and delivered on time.",
    productName: "Organic Tomatoes",
    orderId: 1,
    reviewDate: "2025-01-26",
    visitRating: null,
    visitReview: null
  },
  {
    id: 2,
    farmerId: 2,
    farmerName: "Priya Sharma",
    customerName: "Priya Gupta",
    customerEmail: "priya@example.com",
    rating: 4,
    review: "Great quality fruits. Would definitely order again.",
    productName: "Fresh Mangoes",
    orderId: 2,
    reviewDate: "2025-01-25",
    visitRating: 5,
    visitReview: "Amazing farm visit! Learned so much about organic farming."
  }
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const farmerId = searchParams.get('farmerId');
    const customerEmail = searchParams.get('customerEmail');

    let filteredRatings = [...ratings];

    // Filter by farmer ID
    if (farmerId) {
      filteredRatings = filteredRatings.filter(rating => 
        rating.farmerId === parseInt(farmerId)
      );
    }

    // Filter by customer email
    if (customerEmail) {
      filteredRatings = filteredRatings.filter(rating => 
        rating.customerEmail === customerEmail
      );
    }

    return NextResponse.json({ 
      success: true, 
      ratings: filteredRatings 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: "Failed to fetch ratings" 
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      farmerId, 
      customerName, 
      customerEmail, 
      rating, 
      review, 
      productName, 
      orderId,
      visitRating = null,
      visitReview = null
    } = body;

    // Validate required fields
    if (!farmerId || !customerName || !customerEmail || !rating || !review) {
      return NextResponse.json({ 
        success: false, 
        error: "Missing required fields" 
      }, { status: 400 });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ 
        success: false, 
        error: "Rating must be between 1 and 5" 
      }, { status: 400 });
    }

    // Get farmer name (in real app, fetch from database)
    const farmerName = "Farmer Name"; // This would be fetched from farmers table

    // Create new rating
    const newRating = {
      id: ratings.length + 1,
      farmerId,
      farmerName,
      customerName,
      customerEmail,
      rating,
      review,
      productName: productName || "General",
      orderId: orderId || null,
      reviewDate: new Date().toISOString().split('T')[0],
      visitRating,
      visitReview
    };

    ratings.push(newRating);

    return NextResponse.json({ 
      success: true, 
      rating: newRating 
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: "Failed to create rating" 
    }, { status: 500 });
  }
} 