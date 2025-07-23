import { Button } from "@/components/ui/button";
import { Linkedin, Github, Mail } from "lucide-react";

const socials = [
  { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn" },
  { href: "https://github.com", icon: Github, label: "GitHub" },
  { href: "mailto:info@slamrobotics.com", icon: Mail, label: "Email" },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background/80 backdrop-blur py-6 mt-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4">
        <div className="text-sm text-muted-foreground">© 2025 SLAM Robotics. All rights reserved.</div>
        <div className="flex gap-2">
          {socials.map((s) => (
            <Button asChild variant="ghost" size="icon" key={s.label} aria-label={s.label}>
              <a href={s.href} target={s.href.startsWith('mailto:') ? undefined : "_blank"} rel={s.href.startsWith('mailto:') ? undefined : "noopener noreferrer"}>
                <s.icon className="size-5" />
              </a>
            </Button>
          ))}
        </div>
      </div>
    </footer>
  );
} 