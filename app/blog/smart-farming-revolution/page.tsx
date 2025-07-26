"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SmartFarmingRevolutionPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to Blog
          </Link>
        </div>
      </div>

      {/* Blog Content */}
      <article className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">January 5, 2025</span>
            <span className="text-sm text-green-600 dark:text-green-400">Smart Farming</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🚁 Smart Farming Revolution: Farm Mapping and Drone-Based Fertilizer Delivery
          </h1>
          
          <div className="text-gray-600 dark:text-gray-400">
            <span>By SLAM Robotics</span>
            <span className="mx-2">•</span>
            <span>5 min read</span>
          </div>
        </header>

        {/* Content */}
        <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-200">
          <p className="text-lg leading-relaxed mb-6">
            In today's fast-evolving agricultural landscape, precision farming is no longer a luxury — it's a necessity. To meet the growing demand for food, optimize resources, and tackle labor shortages, farmers are embracing smart technologies. One such innovation is the use of camera and LiDAR-based farm mapping combined with autonomous drone systems for spraying and fertilizer delivery.
          </p>
          
          <p className="text-lg leading-relaxed mb-8">
            At SLAM Robotics, we are redefining how farms operate by integrating robotic intelligence, real-time mapping, and high-powered drone logistics.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            🌾 The Problem: Inefficiency and Inaccessibility
          </h2>
          <p className="mb-4">Many remote or fragmented farmlands suffer from:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Lack of timely access to fertilizers and crop sprays.</li>
            <li>Difficulty in navigating uneven or unstructured terrain.</li>
            <li>Inefficient manual spraying, leading to waste and environmental harm.</li>
            <li>Labor shortages and increased operational costs.</li>
          </ul>
          <p className="mb-8">To address this, we are building a complete drone-based farm management system, starting with intelligent mapping.</p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            📍 Step 1: Farm Mapping using Camera and LiDAR
          </h2>
          <p className="mb-4">Mapping is the foundation of smart farming. Our drones are equipped with high-resolution cameras and LiDAR (Light Detection and Ranging) sensors to create precise 2D and 3D maps of the farmland.</p>
          
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
            🔍 How it works:
          </h3>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Camera module captures high-resolution RGB imagery.</li>
            <li>LiDAR sensor emits laser pulses to measure elevation, vegetation height, and crop density.</li>
            <li>SLAM algorithms (Simultaneous Localization and Mapping) are used to generate real-time maps of the terrain, even in GPS-denied or uneven regions.</li>
            <li>The system automatically identifies crop zones, water-logged patches, and obstacle regions.</li>
          </ul>
          <p className="mb-8">This allows farmers to visualize field conditions, detect issues early, and plan targeted actions — all from a single dashboard.</p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            💧 Step 2: Autonomous Precision Spraying
          </h2>
          <p className="mb-4">After mapping the field, our drones enter action mode. Based on the terrain map, they:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Navigate autonomously using onboard SLAM navigation.</li>
            <li>Spray fertilizers, pesticides, or water only where needed, reducing chemical usage.</li>
            <li>Adjust spray rate and angle dynamically using real-time data.</li>
          </ul>
          <p className="mb-8">This ensures uniform coverage, minimal waste, and faster operations without human error.</p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            🚁 Step 3: High-Power Drone Logistics for Remote Areas
          </h2>
          <p className="mb-4">We go a step further with our high-lift drone fleet designed for:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>Carrying and delivering fertilizers, compost, and micronutrients to hard-to-reach fields or hilly terrains.</li>
            <li>Automated drop-offs at pre-mapped refill stations or coordinates.</li>
            <li>Emergency delivery in case of crop distress signals.</li>
          </ul>
          <p className="mb-8">Whether it's a mountain village or a waterlogged rice field, our drones fly where tractors can't drive.</p>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            ✅ Benefits for Farmers
          </h2>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>30% less fertilizer waste through targeted spraying</li>
            <li>60% time saved compared to manual operations</li>
            <li>100% access to remote fields, thanks to high-lift drone delivery</li>
            <li>Data-driven decisions via real-time farm analytics</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            🔮 What's Next?
          </h2>
          <p className="mb-4">SLAM Robotics is working on integrating:</p>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>AI-based crop health prediction</li>
            <li>Weather-adaptive flight planning</li>
          </ul>
          
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            We're building a future where farming is not just autonomous — it's intelligent, adaptive, and sustainable.
          </p>
        </div>
      </article>
    </main>
  );
} 