"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/tech", label: "Tech" },
  { href: "/product", label: "Product" },
  { href: "/investors", label: "Investors" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme");
      if (stored) setTheme(stored);
      else if (window.matchMedia("(prefers-color-scheme: dark)").matches) setTheme("dark");
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme, mounted]);

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur border-b border-border">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg tracking-tight">SLAM Robotics</span>
        </div>
        <div className="hidden md:flex gap-2">
          {navLinks.map((link) => (
            <Button asChild variant="ghost" key={link.href} className="px-3">
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle dark mode"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </Button>
        </div>
      </div>
      {/* Mobile nav */}
      <div className="flex md:hidden gap-1 px-2 pb-2">
        {navLinks.map((link) => (
          <Button asChild variant="ghost" key={link.href} className="flex-1">
            <Link href={link.href}>{link.label}</Link>
          </Button>
        ))}
      </div>
    </nav>
  );
} 