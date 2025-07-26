import { Button } from "@/components/ui/button";
import { Linkedin, Github, Mail } from "lucide-react";

const socials = [
  { href: "https://www.linkedin.com/company/108078285", icon: Linkedin, label: "LinkedIn" },
  { href: "https://github.com", icon: Github, label: "GitHub" },
  { href: "mailto:slam.robots@gmail.com", icon: Mail, label: "Email" },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-950/90 backdrop-blur py-8 mt-16 shadow-inner">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 px-4 sm:px-6">
        <div className="text-sm text-gray-500 dark:text-gray-400 text-center md:text-left">
          © 2025 <span className="font-semibold text-blue-700 dark:text-blue-400">SLAM Robotics</span>. All rights reserved.
        </div>
        <div className="flex gap-3">
          {socials.map((s) => (
            <Button
              asChild
              variant="ghost"
              size="icon"
              key={s.label}
              aria-label={s.label}
              className="rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900 focus:ring-2 focus:ring-blue-400 transition"
            >
              <a href={s.href} target={s.href.startsWith('mailto:') ? undefined : "_blank"} rel={s.href.startsWith('mailto:') ? undefined : "noopener noreferrer"}>
                <s.icon className="size-6 text-blue-700 dark:text-blue-400 hover:scale-110 transition-transform" />
              </a>
            </Button>
          ))}
        </div>
      </div>
      <div className="w-full text-center mt-4 text-gray-600 dark:text-gray-400 text-sm">
        For inquiries, contact us at <a href="mailto:slam.robots@gmail.com" className="text-blue-700 dark:text-blue-400 underline">slam.robots@gmail.com</a>
      </div>
    </footer>
  );
} 