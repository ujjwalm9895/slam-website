"use client";

import { Card } from "@/components/ui/card";
import { Radar, ShieldCheck, RefreshCw, Layers3 } from "lucide-react";
import Image from "next/image";

const features = [
  {
    title: "Real-time Mapping",
    icon: Radar,
    desc: "The robot builds a map of its surroundings as it moves, updating instantly with new information.",
  },
  {
    title: "Obstacle Avoidance",
    icon: ShieldCheck,
    desc: "It detects and avoids obstacles, making navigation safe and reliable.",
  },
  {
    title: "Loop Closure",
    icon: RefreshCw,
    desc: "The robot recognizes places it has visited before, correcting its map for better accuracy.",
  },
  {
    title: "Sensor Fusion",
    icon: Layers3,
    desc: "It combines data from different sensors (like cameras and LiDAR) for a complete view of the world.",
  },
];

export default function TechPage() {
  return (
    <main className="min-h-screen flex flex-col gap-20 py-10 sm:py-16 px-2 sm:px-4 bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 animate-fade-in">
      {/* Hero Section with Illustration */}
      <section className="flex flex-col md:flex-row items-center justify-center gap-10 max-w-5xl mx-auto mb-8 animate-fade-in">
        <div className="flex-1 flex flex-col items-center md:items-start gap-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-800 dark:text-blue-300 text-center md:text-left mb-2 drop-shadow-lg">SLAM Technology</h1>
          <div className="w-28 h-2 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400 rounded-full blur-sm animate-pulse mb-2" />
          <div className="bg-blue-100 dark:bg-blue-950/80 border border-blue-300 dark:border-blue-800 rounded-2xl px-6 py-4 shadow flex flex-col gap-2 max-w-xl">
            <span className="font-bold text-blue-700 dark:text-blue-300 text-lg">SLAM — Sense. Learn. Act. Move.</span>
            <span className="text-base text-gray-700 dark:text-gray-200">(Also known as Smart Logistic Autonomy & Mobility — for robots of tomorrow)</span>
            <span className="text-gray-700 dark:text-gray-200 text-base mt-2">
              SLAM lets robots explore, understand, and move around new environments—all on their own. It means a robot can figure out where it is while making a map of a place it’s never been before.
            </span>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <Image
            src="/globe.svg"
            alt="SLAM Robotics Globe"
            width={320}
            height={320}
            className="rounded-2xl shadow-xl object-contain bg-blue-50 dark:bg-blue-900 p-4"
            priority
          />
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-5xl mx-auto w-full animate-fade-in">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-blue-700 dark:text-blue-300 text-center">Key SLAM Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {features.map((f, i) => (
            <Card key={f.title} className={`flex flex-col items-center text-center py-14 px-8 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-200 group border-2 glassmorphic-card relative overflow-hidden 
              bg-white dark:bg-gray-950 border-blue-100 dark:border-blue-800`}
            >
              <div className={`absolute top-0 left-0 w-full h-2 rounded-t-3xl ${i === 0 ? 'bg-blue-600' : i === 1 ? 'bg-emerald-500' : i === 2 ? 'bg-orange-400' : 'bg-sky-400'} opacity-40`} />
              <f.icon className={`size-16 mb-4 drop-shadow-lg ${i === 0 ? 'text-blue-600' : i === 1 ? 'text-emerald-500' : i === 2 ? 'text-orange-400' : 'text-sky-500'} group-hover:scale-110 transition-transform duration-200`} />
              <div className="font-semibold text-2xl mb-2 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">{f.title}</div>
              <div className="text-gray-700 dark:text-gray-200 text-lg leading-relaxed">{f.desc}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* Summary Row */}
      <section className="max-w-5xl mx-auto w-full flex flex-col items-center gap-4 mt-12 animate-fade-in">
        <div className="bg-gradient-to-r from-blue-500 via-blue-700 to-blue-500 text-white rounded-2xl px-8 py-7 shadow-xl text-center text-2xl font-semibold max-w-2xl border-2 border-blue-200 dark:border-blue-800">
          SLAM is the backbone of next-generation robotics—enabling safe, smart, and fully autonomous navigation in any environment.
        </div>
      </section>

      {/* Advanced AgriTech Capabilities */}
      <section className="max-w-5xl mx-auto w-full animate-fade-in">
        <div className="text-center mb-16">
          <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full text-sm font-semibold mb-6">
            Cutting-Edge Technology
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
            Advanced AgriTech Capabilities
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Experience the future of farming with cutting-edge robotics, AI, and IoT technologies designed to revolutionize agricultural productivity and sustainability.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Robotics & Autonomous Systems */}
          <Card className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">01</div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Robotics & Autonomous Systems</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Advanced computer vision, object detection, autonomous navigation, and field boundary recognition for safe and intelligent agricultural robotics.
              </p>
              <div className="mt-6 flex items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                Learn More
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Card>

          {/* Smart Agriculture Services */}
          <Card className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">02</div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Smart Agriculture Services</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                AI-powered crop advisory, web/mobile dashboards with personalized recommendations and real-time pest alerts for optimal farming decisions.
              </p>
              <div className="mt-6 flex items-center text-emerald-600 dark:text-emerald-400 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                Learn More
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Card>

          {/* Soil Testing & Intelligence */}
          <Card className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-orange-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.781 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <div className="text-sm font-semibold text-orange-600 dark:text-orange-400">03</div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Soil Testing & Intelligence</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Instant soil reports, mobile connectivity, and AI-based soil health engine for comprehensive soil analysis and smart recommendations.
              </p>
              <div className="mt-6 flex items-center text-orange-600 dark:text-orange-400 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                Learn More
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Card>

          {/* Machinery Rental / Marketplace */}
          <Card className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-50 to-sky-100 dark:from-sky-950 dark:to-sky-900 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-r from-sky-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-sky-600 to-sky-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="text-sm font-semibold text-sky-600 dark:text-sky-400">04</div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Machinery Rental / Marketplace</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Smart rental system with GPS tracking, IoT-based maintenance alerts, and farmer-machine matchmaking for efficient equipment management.
              </p>
              <div className="mt-6 flex items-center text-sky-600 dark:text-sky-400 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                Learn More
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Card>

          {/* Farm Data Intelligence */}
          <Card className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 sm:col-span-2">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="text-sm font-semibold text-purple-600 dark:text-purple-400">05</div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Farm Data Intelligence</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Secure farm data platform with blockchain protection, government scheme matching, and AI/ML predictions for yield forecasting and pest prediction.
              </p>
              <div className="mt-6 flex items-center text-purple-600 dark:text-purple-400 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                Learn More
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Card>
        </div>

        <div className="text-center mt-16">
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
            Explore Our Solutions
          </button>
        </div>
      </section>

      {/* Detailed Learn More Section */}
      <section className="max-w-6xl mx-auto w-full animate-fade-in">
        <div className="text-center mb-16">
          <div className="inline-block bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-full text-sm font-semibold mb-6">
            Learn More
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
            Understanding Our Technology
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Discover how our advanced technology works and how it can transform your farming experience. 
            We explain everything in simple terms that every farmer can understand.
          </p>
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
        .dark .glassmorphic-card {
          background: rgba(10,18,40,0.92);
          box-shadow: 0 8px 32px 0 rgba(31,38,135,0.25);
        }
      `}</style>
    </main>
  );
} 