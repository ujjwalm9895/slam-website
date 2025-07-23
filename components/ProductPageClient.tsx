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
    <main className="max-w-4xl mx-auto py-12 px-4 flex flex-col gap-12">
      <AnimatedProductHero />
      <section className="flex flex-col gap-8">
        {features.map((f) => (
          <Card key={f.title} className="flex flex-col md:flex-row items-center md:items-start gap-6 p-6">
            <f.icon className="size-14 text-primary flex-shrink-0" />
            <div className="text-center md:text-left">
              <CardHeader className="p-0 mb-1">
                <CardTitle className="text-xl">{f.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-base text-muted-foreground">
                {f.desc}
              </CardContent>
            </div>
          </Card>
        ))}
      </section>
    </main>
  );
} 