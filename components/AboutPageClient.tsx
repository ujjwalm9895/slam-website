"use client";
import Image from "next/image";
import { Sparkles, Users, ShieldCheck, TrendingUp } from "lucide-react";

const team = [
  {
    name: "Vijay Nagar",
    role: "Co-Founder & Vision Engineer",
    img: "/vijay.jpeg",
    quote: 'I believe technology should empower those who feed the world.',
  },
  {
    name: "Ujjwal Madawat",
    role: "Co-Founder & Machine Learning Engineer",
    img: "/ujjwal.jpg",
    quote: 'AI can transform Indian agriculture—making it &quot;smarter&quot;, fairer, and more human.',
  },
];

const impact = [
  { icon: Users, label: "Farmers Empowered", value: "10,000+" },
  { icon: TrendingUp, label: "AI for Bharat", value: "100%" },
  { icon: ShieldCheck, label: "Trust & Impact", value: "Nationwide" },
];

export default function AboutPageClient() {
  return (
    <main className="relative min-h-screen flex flex-col gap-16 pb-16 bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 overflow-x-hidden">
      {/* Heroic Mission Section */}
      <section className="relative flex flex-col items-center justify-center py-16 px-4 sm:px-8 animate-fade-in">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="w-full h-full bg-gradient-to-tr from-blue-200/40 via-blue-100/20 to-blue-400/10 dark:from-blue-900/40 dark:via-blue-950/20 dark:to-blue-800/10 animate-gradient-move" />
        </div>
        <h1 className="relative z-10 text-4xl sm:text-5xl font-extrabold text-center text-blue-800 dark:text-blue-300 drop-shadow-lg mb-4">
          Empowering Indian Agriculture<br />with Intelligent Robotics
        </h1>
        <div className="relative z-10 w-32 h-2 mx-auto mb-4 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400 rounded-full blur-sm animate-pulse" />
        <p className="relative z-10 text-lg sm:text-xl text-gray-700 dark:text-gray-200 text-center max-w-2xl mb-2">
          Our mission: <span className="font-semibold text-blue-700 dark:text-blue-400">Affordable, accessible, and empathetic robotics for every Indian farmer.</span>
        </p>
        <p className="relative z-10 text-base text-gray-500 dark:text-gray-400 text-center max-w-xl">
          Bridging technology and tradition to create a future where farming is dignified, efficient, and sustainable.
        </p>
      </section>

      {/* Impact Metrics */}
      <section className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 px-4 animate-fade-in">
        {impact.map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-2">
            <item.icon className="size-10 text-blue-600 dark:text-blue-400 mb-1 animate-bounce-slow" />
            <span className="text-2xl font-bold text-blue-800 dark:text-blue-300">{item.value}</span>
            <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">{item.label}</span>
          </div>
        ))}
      </section>

      {/* Narrative Story Section */}
      <section className="flex justify-center px-2 animate-fade-in">
        <div className="relative max-w-2xl w-full glassmorphic-card rounded-3xl p-8 shadow-2xl border border-blue-100 dark:border-blue-900 bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg">
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400 rounded-full p-2 shadow-lg animate-pulse">
            <Sparkles className="size-8 text-white" />
          </div>
          <blockquote className="italic text-blue-800 dark:text-blue-300 text-xl font-semibold text-center mb-4">
            We believe the next green revolution in India will be powered by empathy, intelligence, and robotics
          </blockquote>
          <p className="text-gray-700 dark:text-gray-200 text-lg leading-relaxed text-center mb-2">
            We saw the challenges faced by Indian farmers—labor shortages, inefficiency, and a lack of accessible automation. With expertise in robotics and AI, we set out to make a difference.
          </p>
          <p className="text-gray-700 dark:text-gray-200 text-lg leading-relaxed text-center mb-2">
            Inspired by the resilience and hope of the farming community, our mission became clear: make robotics truly accessible, restore dignity, and boost productivity for every farmer.
          </p>
          <p className="text-gray-700 dark:text-gray-200 text-lg leading-relaxed text-center font-semibold">
            Today, we are building technology that uplifts communities, inspires innovation, and plants the seeds for a sustainable tomorrow in Indian agriculture.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section className="flex flex-col items-center gap-8 animate-fade-in">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-blue-700 dark:text-blue-400 text-center">Meet the Visionaries</h2>
        <div className="relative flex flex-col sm:flex-row items-center justify-center gap-10 sm:gap-12 md:gap-16">
          {team.map((member) => (
            <div
              key={member.name}
              className="relative z-10 flex flex-col items-center py-8 px-6 bg-white dark:bg-gray-900 rounded-2xl border border-blue-100 dark:border-blue-900 shadow-xl hover:shadow-2xl transition-shadow duration-200 group w-full max-w-xs"
              style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)" }}
            >
              <div className="relative mb-4 flex items-center justify-center">
                <span className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 via-blue-200 to-blue-500 dark:from-blue-700 dark:via-blue-900 dark:to-blue-500 blur-[2.5px] opacity-60 scale-110" />
                <Image
                  src={member.img}
                  alt={member.name}
                  width={112}
                  height={112}
                  className="relative z-10 rounded-full object-cover w-28 h-28 shadow-lg group-hover:scale-105 transition-transform duration-200 border-4 border-white dark:border-gray-900"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://placehold.co/112x112?text=Photo";
                  }}
                />
              </div>
              <span className="relative z-20 -mt-4 mb-2 bg-blue-600 dark:bg-blue-400 text-white text-xs px-3 py-1 rounded-full shadow animate-pulse border-2 border-white dark:border-gray-900">Co-Founder</span>
              <div className="font-semibold text-lg text-gray-800 dark:text-gray-100 mt-2 text-center">{member.name}</div>
              <div className="text-blue-700 dark:text-blue-400 text-sm font-medium mb-2 text-center">{member.role}</div>
              <div className="italic text-gray-500 dark:text-gray-300 text-center text-sm" dangerouslySetInnerHTML={{ __html: member.quote }} />
            </div>
          ))}
        </div>
      </section>

      {/* Investor Callout */}
      <section className="flex flex-col items-center justify-center gap-4 py-10 animate-fade-in">
        <div className="flex items-center gap-3 mb-2">
          <ShieldCheck className="size-8 text-yellow-500 drop-shadow animate-bounce-slow" />
          <span className="text-xl sm:text-2xl font-bold text-yellow-600 dark:text-yellow-400">Why Invest in Us?</span>
        </div>
        <p className="text-center text-lg text-gray-700 dark:text-gray-200 max-w-xl mb-2">
          We are building the future of Indian agriculture—one that is intelligent, inclusive, and impactful. Join us in empowering millions of farmers and shaping a new era of tech-for-good.
        </p>
        <a
          href="/contact"
          className="inline-block rounded-2xl bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 text-gray-900 font-bold px-8 py-4 shadow-lg hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all text-lg animate-glow"
        >
          Connect with Us
        </a>
      </section>

      {/* Animations (Tailwind custom classes) */}
      <style jsx global>{`
        @keyframes gradient-move {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        .animate-gradient-move {
          background-size: 200% 200%;
          animation: gradient-move 8s linear infinite;
        }
        .glassmorphic-card {
          background: rgba(255,255,255,0.7);
          box-shadow: 0 8px 32px 0 rgba(31,38,135,0.15);
          backdrop-filter: blur(8px);
        }
        .animate-fade-in {
          animation: fadeInUp 1s cubic-bezier(0.23, 1, 0.32, 1);
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(32px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-bounce-slow {
          animation: bounce 2.5s infinite;
        }
        .animate-glow {
          box-shadow: 0 0 16px 2px #fde047, 0 0 32px 4px #facc15;
        }
      `}</style>
    </main>
  );
} 