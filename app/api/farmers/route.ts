import { NextRequest, NextResponse } from "next/server";

// Mock database - replace with real database
let farmers = [
  {
    id: 1,
    name: "Rajesh Patel",
    location: "Punjab",
    rating: 4.8,
    reviews: 127,
    specialties: ["Organic Vegetables", "Dairy"],
    visitAllowed: true,
    image: "/farming_robots.jpg",
    products: ["Tomatoes", "Milk", "Potatoes"],
    description: "Organic farmer with 15 years of experience",
    contact: "+91-98765-43210",
    farmSize: "25 acres"
  },
  {
    id: 2,
    name: "Priya Sharma",
    location: "Maharashtra",
    rating: 4.9,
    reviews: 89,
    specialties: ["Fruits", "Herbs"],
    visitAllowed: false,
    image: "/farming_robots.jpg",
    products: ["Mangoes", "Basil", "Oranges"],
    description: "Specialized in organic fruit farming",
    contact: "+91-98765-43211",
    farmSize: "15 acres"
  },
  {
    id: 3,
    name: "Amit Kumar",
    location: "Haryana",
    rating: 4.7,
    reviews: 156,
    specialties: ["Grains", "Pulses"],
    visitAllowed: true,
    image: "/farming_robots.jpg",
    products: ["Wheat", "Rice", "Lentils"],
    description: "Traditional grain farmer",
    contact: "+91-98765-43212",
    farmSize: "40 acres"
  }
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const location = searchParams.get('location');

    let filteredFarmers = [...farmers];

    // Filter by category
    if (category) {
      filteredFarmers = filteredFarmers.filter(farmer => 
        farmer.specialties.some(specialty => 
          specialty.toLowerCase().includes(category.toLowerCase())
        )
      );
    }

    // Filter by location
    if (location) {
      filteredFarmers = filteredFarmers.filter(farmer =>
        farmer.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    return NextResponse.json({ 
      success: true, 
      farmers: filteredFarmers 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: "Failed to fetch farmers" 
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, location, specialties, description, contact, farmSize, visitAllowed } = body;

    // Validate required fields
    if (!name || !location || !specialties || !description || !contact) {
      return NextResponse.json({ 
        success: false, 
        error: "Missing required fields" 
      }, { status: 400 });
    }

    // Create new farmer
    const newFarmer = {
      id: farmers.length + 1,
      name,
      location,
      rating: 0,
      reviews: 0,
      specialties: Array.isArray(specialties) ? specialties : [specialties],
      visitAllowed: visitAllowed || false,
      image: "/farming_robots.jpg",
      products: [],
      description,
      contact,
      farmSize: farmSize || "Not specified"
    };

    farmers.push(newFarmer);

    return NextResponse.json({ 
      success: true, 
      farmer: newFarmer 
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: "Failed to create farmer" 
    }, { status: 500 });
  }
} 