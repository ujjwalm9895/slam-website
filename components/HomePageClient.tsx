"use client";
import AnimatedHomeHero from "@/components/AnimatedHomeHero";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function HomePageClient() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-16 gap-16 text-center">
      <AnimatedHomeHero />
      {/* Core Benefits Section */}
      <section className="w-full max-w-5xl flex flex-col items-center gap-8" id="support">
        <h2 className="text-2xl font-bold mb-2">Core Benefits</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Real-time Mapping</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Our robots build and update detailed maps of their environment in real time, enabling instant adaptation to new spaces and obstacles.
              </p>
            </CardContent>
          </Card>
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Sensor Fusion</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                We combine data from LiDAR, cameras, and IMUs for robust perception, ensuring reliable operation in complex and dynamic environments.
              </p>
            </CardContent>
          </Card>
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Autonomous Navigation</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Advanced algorithms empower our robots to navigate safely and efficiently, making intelligent decisions without human intervention.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
} 