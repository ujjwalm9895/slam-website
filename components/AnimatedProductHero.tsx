"use client";
import { motion } from "framer-motion";

export default function AnimatedProductHero() {
  return (
    <motion.section
      className="text-center mb-4"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Our Robot Platform</h1>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        Built for real-world autonomy, our platform combines robust navigation, mobility, and precision sensing for next-generation robotics.
      </p>
    </motion.section>
  );
} 