"use client";
import AnimatedHomeHero from "@/components/AnimatedHomeHero";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Leaf, Droplets, Users, DollarSign, Radar, ShieldCheck, RefreshCw, Layers3 } from "lucide-react";

export default function HomePageClient() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[70vh] px-2 sm:px-4 py-10 sm:py-16 gap-16 text-center bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 animate-fade-in">
      {/* Hero Section with Image */}
      <section className="w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-16 py-8 animate-fade-in">
        <div className="flex-1 flex flex-col items-center md:items-start justify-center gap-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-800 dark:text-blue-300 drop-shadow-lg mb-2 text-center md:text-left">
            Empowering Indian Agriculture<br />with Intelligent Robotics
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-200 max-w-xl mb-2 text-center md:text-left">
            Affordable, accessible, and empathetic robotics for every Indian farmer.
          </p>
          <p className="text-base text-gray-500 dark:text-gray-400 max-w-lg mb-4 text-center md:text-left">
            Bridging technology and tradition to create a future where farming is dignified, efficient, and sustainable.
          </p>
          <a href="#challenges" className="inline-block rounded-2xl bg-gradient-to-r from-blue-500 via-blue-700 to-blue-500 text-white font-bold px-8 py-4 shadow-lg hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-lg animate-glow">
            See the Challenges
          </a>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <Image
            src="/hero-farm-robot.svg"
            alt="SLAM Robotics in Farming"
            width={400}
            height={320}
            className="rounded-2xl shadow-xl object-contain bg-blue-100 dark:bg-blue-900 p-4"
            priority
          />
        </div>
      </section>

      {/* Farming Needs & Automation Vision Section */}
      <section id="challenges" className="max-w-5xl mx-auto py-12 px-4 flex flex-col gap-12 bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 rounded-2xl shadow-xl my-12 animate-fade-in">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-800 dark:text-blue-300 text-center mb-2">Challenges in Modern Farming</h2>
        <p className="text-lg text-gray-700 dark:text-gray-200 text-center mb-8">
          Indian farmers face a range of challenges — from soil health to labor shortages. Here’s what they need, and how automation can help.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Soil & Crop */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-blue-100 dark:border-blue-900 flex flex-col gap-3 items-center">
            <Leaf className="size-10 text-green-600 dark:text-green-400 mb-2" />
            <h3 className="text-xl font-bold text-blue-700 dark:text-blue-400 mb-2">Soil & Crop</h3>
            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-200 mb-2 text-left w-full">
              <li>Lack of Soil Testing</li>
              <li>No guidance on crop selection</li>
              <li>Difficulty accessing authentic seeds</li>
            </ul>
            <p className="text-blue-700 dark:text-blue-400 text-sm mt-2 text-center">
              <b>SLAM-based robots</b> can analyze soil, recommend crops, and verify seed quality in real time.
            </p>
          </div>
          {/* Infrastructure & Automation */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-blue-100 dark:border-blue-900 flex flex-col gap-3 items-center">
            <Droplets className="size-10 text-blue-500 dark:text-blue-300 mb-2" />
            <h3 className="text-xl font-bold text-blue-700 dark:text-blue-400 mb-2">Infrastructure & Automation</h3>
            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-200 mb-2 text-left w-full">
              <li>Limited machinery support</li>
              <li>Need for automatic sprinkler systems for large farms</li>
              <li>Drone spraying systems not widely adopted</li>
              <li>No reliable info on timing for sowing, watering, and harvesting</li>
            </ul>
            <p className="text-blue-700 dark:text-blue-400 text-sm mt-2 text-center">
              <b>SLAM-powered automation</b> enables precision irrigation, drone spraying, and smart scheduling for every field.
            </p>
          </div>
          {/* Labor & Monitoring */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-blue-100 dark:border-blue-900 flex flex-col gap-3 items-center">
            <Users className="size-10 text-yellow-600 dark:text-yellow-400 mb-2" />
            <h3 className="text-xl font-bold text-blue-700 dark:text-blue-400 mb-2">Labor & Monitoring</h3>
            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-200 mb-2 text-left w-full">
              <li>Shortage of skilled farm labor</li>
              <li>Need for automation to enable single-person monitoring</li>
            </ul>
            <p className="text-blue-700 dark:text-blue-400 text-sm mt-2 text-center">
              <b>Robotics with SLAM</b> allows one person to monitor and manage large farms efficiently and safely.
            </p>
          </div>
          {/* Finance */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border border-blue-100 dark:border-blue-900 flex flex-col gap-3 items-center">
            <DollarSign className="size-10 text-emerald-600 dark:text-emerald-400 mb-2" />
            <h3 className="text-xl font-bold text-blue-700 dark:text-blue-400 mb-2">Finance</h3>
            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-200 mb-2 text-left w-full">
              <li>High-interest financial options</li>
              <li>Lack of low-interest support</li>
            </ul>
            <p className="text-blue-700 dark:text-blue-400 text-sm mt-2 text-center">
              <b>Smart data from SLAM systems</b> can help farmers access better credit and support by proving efficiency and need.
            </p>
          </div>
        </div>
        <div className="text-center mt-8">
          <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-6 py-3 rounded-2xl font-semibold shadow">
            <b>SLAM — Sense. Learn. Act. Move.</b> <br />
            <span className="text-base font-normal">Empowering Indian farmers with robotics and automation for a smarter, more sustainable future.</span>
          </span>
        </div>
      </section>

      {/* Core Benefits Section */}
      <section className="w-full max-w-5xl flex flex-col items-center gap-10 animate-fade-in">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-blue-700 dark:text-blue-400">Core Benefits</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full">
          <Card className="flex-1 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-200 group bg-white dark:bg-gray-900 border border-blue-100 dark:border-blue-900 flex flex-col items-center gap-4 py-8">
            <Radar className="size-10 text-blue-600 dark:text-blue-400 mb-2" />
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl font-semibold group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">Real-time Mapping</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Our robots build and update detailed maps of their environment in real time, enabling instant adaptation to new spaces and obstacles.
              </p>
            </CardContent>
          </Card>
          <Card className="flex-1 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-200 group bg-white dark:bg-gray-900 border border-blue-100 dark:border-blue-900 flex flex-col items-center gap-4 py-8">
            <Layers3 className="size-10 text-blue-600 dark:text-blue-400 mb-2" />
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl font-semibold group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">Sensor Fusion</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                We combine data from LiDAR, cameras, and IMUs for robust perception, ensuring reliable operation in complex and dynamic environments.
              </p>
            </CardContent>
          </Card>
          <Card className="flex-1 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-200 group bg-white dark:bg-gray-900 border border-blue-100 dark:border-blue-900 flex flex-col items-center gap-4 py-8">
            <ShieldCheck className="size-10 text-blue-600 dark:text-blue-400 mb-2" />
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl font-semibold group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">Autonomous Navigation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Advanced algorithms empower our robots to navigate safely and efficiently, making intelligent decisions without human intervention.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
      <style jsx global>{`
        .animate-fade-in {
          animation: fadeInUp 1s cubic-bezier(0.23, 1, 0.32, 1);
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(32px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .glassmorphic-card {
          background: rgba(255,255,255,0.7);
          box-shadow: 0 8px 32px 0 rgba(31,38,135,0.15);
          backdrop-filter: blur(8px);
        }
        .animate-glow {
          box-shadow: 0 0 16px 2px #3b82f6, 0 0 32px 4px #2563eb;
        }
      `}</style>
    </main>
  );
} 