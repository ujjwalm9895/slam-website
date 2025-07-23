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
    <main className="max-w-4xl mx-auto py-10 sm:py-16 px-2 sm:px-4 flex flex-col gap-14 bg-gradient-to-b from-white via-blue-50 to-blue-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* What is SLAM? */}
      <Card className="rounded-2xl shadow-lg bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl font-bold text-blue-700 dark:text-blue-400">What is SLAM?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-200 text-lg leading-relaxed">
            SLAM stands for <b>Simultaneous Localization and Mapping</b>. It means a robot can figure out where it is while making a map of a place it’s never been before. SLAM lets robots explore, understand, and move around new environments—all on their own!
          </p>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <section>
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-blue-700 dark:text-blue-400 text-center">Key SLAM Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {features.map((f) => (
            <Card key={f.title} className="flex flex-col items-center text-center py-10 px-4 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-200 group bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
              <f.icon className="size-12 text-blue-700 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform duration-200" />
              <div className="font-semibold text-lg sm:text-xl mb-2 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">{f.title}</div>
              <div className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">{f.desc}</div>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
} 