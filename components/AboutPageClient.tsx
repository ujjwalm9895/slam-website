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
    <main className="max-w-3xl mx-auto py-12 px-4 flex flex-col gap-10">
      <AnimatedMission />
      <AnimatedStory />
      <section>
        <h2 className="text-xl font-bold mb-4">Meet the Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {team.map((member) => (
            <div key={member.name} className="items-center flex flex-col py-6 bg-card rounded-xl border shadow-sm">
              <Image
                src={member.img}
                alt={member.name}
                width={80}
                height={80}
                className="rounded-full bg-muted mb-3 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://placehold.co/80x80?text=Photo";
                }}
              />
              <div className="font-semibold text-base mt-2">{member.name}</div>
              <div className="text-muted-foreground text-sm">{member.role}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
} 