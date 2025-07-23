"use client";
import AnimatedProductHero from "@/components/AnimatedProductHero";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MapPinned, Truck, Ruler } from "lucide-react";

const features = [
  {
    title: "Indoor Navigation",
    icon: MapPinned,
    desc: "Effortlessly navigates complex indoor spaces, adapting to changing layouts and obstacles in real time.",
  },
  {
    title: "Warehouse Mobility",
    icon: Truck,
    desc: "Optimized for warehouse environments, our robot moves goods efficiently and safely among people and equipment.",
  },
  {
    title: "High Precision Sensors",
    icon: Ruler,
    desc: "Equipped with advanced LiDAR and IMUs, the platform delivers centimeter-level accuracy for mapping and movement.",
  },
];

export default function ProductPageClient() {
  return (
    <main className="max-w-4xl mx-auto py-10 sm:py-16 px-2 sm:px-4 flex flex-col gap-14 bg-gradient-to-b from-white via-blue-50 to-blue-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <AnimatedProductHero />
      <section className="flex flex-col gap-10">
        {features.map((f) => (
          <Card key={f.title} className="flex flex-col md:flex-row items-center md:items-start gap-6 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-200 group bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
            <f.icon className="size-16 text-blue-700 dark:text-blue-400 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
            <div className="text-center md:text-left">
              <CardHeader className="p-0 mb-1">
                <CardTitle className="text-xl font-bold group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">{f.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                {f.desc}
              </CardContent>
            </div>
          </Card>
        ))}
      </section>
    </main>
  );
} 