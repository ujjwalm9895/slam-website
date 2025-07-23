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
    <main className="max-w-4xl mx-auto py-12 px-4 flex flex-col gap-10">
      {/* What is SLAM? */}
      <Card>
        <CardHeader>
          <CardTitle>What is SLAM?</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            SLAM stands for <b>Simultaneous Localization and Mapping</b>. It means a robot can figure out where it is while making a map of a place it’s never been before. SLAM lets robots explore, understand, and move around new environments—all on their own!
          </p>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <section>
        <h2 className="text-xl font-bold mb-4 text-center">Key SLAM Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((f) => (
            <Card key={f.title} className="flex flex-col items-center text-center py-8">
              <f.icon className="size-10 text-primary mb-3" />
              <div className="font-semibold text-lg mb-1">{f.title}</div>
              <div className="text-muted-foreground text-sm">{f.desc}</div>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
} 