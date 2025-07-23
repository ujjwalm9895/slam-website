"use client";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function AnimatedMission() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Our Mission</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            At SLAM Robotics, our mission is to revolutionize autonomous navigation with cutting-edge Simultaneous Localization and Mapping (SLAM) technology. We empower robots to understand and interact with the world in real time, making automation safer, smarter, and more accessible.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function AnimatedStory() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Our Story</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            SLAM Robotics began as a passion project among friends in a university robotics lab. Inspired by the challenges of real-world navigation, we set out to build robots that could truly understand and adapt to their environments. Our journey has taken us from late-night brainstorming sessions to launching a company dedicated to innovation, collaboration, and impact.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
} 