"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function AnimatedHomeHero() {
  return (
    <motion.section
      className="flex flex-col items-center gap-6"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <h1 className="text-4xl md:text-5xl font-extrabold max-w-2xl">
        Building the Future of Navigation with <span className="text-primary">SLAM</span>
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
        Autonomous robots that see, map, and navigate the world
      </p>
      <Button asChild size="lg" className="mt-4 text-lg px-8 py-6">
        <a href="#support">Support Our Vision</a>
      </Button>
    </motion.section>
  );
} 