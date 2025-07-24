"use client";

export default function BlogPage() {
  return (
    <main className="flex flex-col items-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-2 sm:px-4 py-10 gap-8 animate-fade-in">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-800 dark:text-blue-300 mb-8 text-center drop-shadow-lg">Latest Updates</h1>
      <section className="w-full max-w-2xl mx-auto flex flex-col gap-8">
        <article className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-blue-100 dark:border-blue-900 p-8 flex flex-col gap-4 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-semibold text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded-full">March 21, 2025</span>
          </div>
          <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-2">SLAM Robotics launches first prototype</h2>
          <p className="text-gray-700 dark:text-gray-200 text-lg">
            We are excited to announce the launch of our first SLAM-enabled robot prototype, setting a new standard for autonomous navigation!
          </p>
        </article>
      </section>
      <style jsx global>{`
        .animate-fade-in {
          animation: fadeInUp 1s cubic-bezier(0.23, 1, 0.32, 1);
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(32px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
} 