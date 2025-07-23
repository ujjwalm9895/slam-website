"use client";
import AnimatedHomeHero from "@/components/AnimatedHomeHero";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function HomePageClient() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[70vh] px-2 sm:px-4 py-10 sm:py-16 gap-16 text-center bg-gradient-to-b from-white via-blue-50 to-blue-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <AnimatedHomeHero />
      {/* Core Benefits Section */}
      <section className="w-full max-w-5xl flex flex-col items-center gap-10" id="support">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-800 dark:text-gray-100">Core Benefits</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          <Card className="flex-1 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-200 group">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl font-semibold group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">Real-time Mapping</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Our robots build and update detailed maps of their environment in real time, enabling instant adaptation to new spaces and obstacles.
              </p>
            </CardContent>
          </Card>
          <Card className="flex-1 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-200 group">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl font-semibold group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">Sensor Fusion</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                We combine data from LiDAR, cameras, and IMUs for robust perception, ensuring reliable operation in complex and dynamic environments.
              </p>
            </CardContent>
          </Card>
          <Card className="flex-1 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-200 group">
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
    </main>
  );
} 