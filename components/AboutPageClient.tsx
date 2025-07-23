"use client";
import { AnimatedMission, AnimatedStory } from "@/components/AnimatedAboutSections";
import Image from "next/image";

const team = [
  {
    name: "Alex Kim",
    role: "Founder & CEO",
    img: "/team-placeholder-1.png",
  },
  {
    name: "Jordan Lee",
    role: "Lead Robotics Engineer",
    img: "/team-placeholder-2.png",
  },
  {
    name: "Morgan Patel",
    role: "SLAM Algorithm Specialist",
    img: "/team-placeholder-3.png",
  },
];

export default function AboutPageClient() {
  return (
    <main className="max-w-3xl mx-auto py-10 sm:py-16 px-2 sm:px-4 flex flex-col gap-12 bg-gradient-to-b from-white via-blue-50 to-blue-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <AnimatedMission />
      <AnimatedStory />
      <section>
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-blue-700 dark:text-blue-400 text-center">Meet the Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {team.map((member) => (
            <div key={member.name} className="flex flex-col items-center py-8 px-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-lg hover:shadow-2xl transition-shadow duration-200">
              <Image
                src={member.img}
                alt={member.name}
                width={96}
                height={96}
                className="rounded-full bg-blue-100 dark:bg-blue-950 mb-4 object-cover w-24 h-24 border-4 border-blue-200 dark:border-blue-900 shadow"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://placehold.co/96x96?text=Photo";
                }}
              />
              <div className="font-semibold text-lg text-gray-800 dark:text-gray-100 mt-2">{member.name}</div>
              <div className="text-blue-700 dark:text-blue-400 text-sm font-medium">{member.role}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
} 