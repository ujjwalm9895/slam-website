"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Radar, ShieldCheck, RefreshCw, Layers3 } from "lucide-react";

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
    <main className="min-h-screen flex flex-col gap-16 py-10 sm:py-16 px-2 sm:px-4 bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 animate-fade-in">
      {/* SLAM Definition Section */}
      <section className="flex flex-col items-center justify-center gap-4 max-w-2xl mx-auto mb-8 animate-fade-in">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-800 dark:text-blue-300 text-center mb-2 drop-shadow-lg">What is SLAM?</h1>
        <div className="w-24 h-2 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400 rounded-full blur-sm animate-pulse mb-2" />
        <Card className="rounded-2xl shadow-xl glassmorphic-card border border-blue-100 dark:border-blue-900 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg px-6 py-8">
          <CardContent>
            <p className="text-gray-700 dark:text-gray-200 text-lg leading-relaxed text-center">
              <span className="font-bold text-blue-700 dark:text-blue-400">SLAM — Sense. Learn. Act. Move.</span><br />
              <span className="text-base text-gray-500 dark:text-gray-400">(Also known as Smart Logistic Autonomy & Mobility — for robots of tomorrow)</span><br /><br />
              It means a robot can figure out where it is while making a map of a place it’s never been before. SLAM lets robots explore, understand, and move around new environments—all on their own!
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Features Grid */}
      <section className="max-w-4xl mx-auto w-full animate-fade-in">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-blue-700 dark:text-blue-400 text-center">Key SLAM Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {features.map((f) => (
            <Card key={f.title} className="flex flex-col items-center text-center py-12 px-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-200 group bg-white dark:bg-gray-900 border border-blue-100 dark:border-blue-900 glassmorphic-card">
              <f.icon className="size-14 sm:size-16 text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-200 drop-shadow-lg" />
              <div className="font-semibold text-xl sm:text-2xl mb-2 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">{f.title}</div>
              <div className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">{f.desc}</div>
            </Card>
          ))}
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
      `}</style>
    </main>
  );
} 