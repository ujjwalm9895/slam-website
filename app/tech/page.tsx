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