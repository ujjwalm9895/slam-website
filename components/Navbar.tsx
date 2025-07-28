"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import Image from "next/image";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/product", label: "Product" },
  { href: "/tech", label: "Tech" },
  { href: "/investors", label: "Investors" },
  { href: "/blog", label: "Blog" },
  { href: "/weather", label: "Weather" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState("light");
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme");
      if (stored) setTheme(stored);
      else if (window.matchMedia("(prefers-color-scheme: dark)").matches) setTheme("dark");
      // Enable smooth scroll globally
      document.documentElement.classList.add("scroll-smooth");
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
    <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-950/80 backdrop-blur border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
        <div className="flex items-center gap-3">
          <Image
            src="/slam-logo.png"
            alt="SLAM Robotics Logo"
            width={40}
            height={40}
            className="rounded-md shadow-sm bg-white dark:bg-gray-900 p-1"
            priority
          />
          <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-blue-700 dark:text-blue-400 select-none">SLAM Robotics</span>
        </div>
        <div className="hidden md:flex gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`inline-flex items-center px-4 py-2 rounded-2xl font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400
                  ${isActive ? "text-blue-700 dark:text-blue-400 underline underline-offset-8 decoration-2 decoration-blue-400 dark:decoration-blue-500 bg-blue-50/60 dark:bg-blue-900/40 shadow-sm" : "text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300"}
                `}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle dark mode"
            className="rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900 focus:ring-2 focus:ring-blue-400 transition"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </Button>
          <button
            className="md:hidden ml-2 p-2 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900 focus:ring-2 focus:ring-blue-400 transition"
            aria-label="Open menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span className="block w-6 h-0.5 bg-gray-700 dark:bg-gray-200 mb-1 rounded"></span>
            <span className="block w-6 h-0.5 bg-gray-700 dark:bg-gray-200 mb-1 rounded"></span>
            <span className="block w-6 h-0.5 bg-gray-700 dark:bg-gray-200 rounded"></span>
          </button>
        </div>
      </div>
      {/* Mobile nav */}
      <div
        className={`md:hidden transition-all duration-300 bg-white/95 dark:bg-gray-950/95 border-t border-gray-100 dark:border-gray-800 shadow ${mobileOpen ? "max-h-96 py-2" : "max-h-0 overflow-hidden py-0"}`}
      >
        <div className="flex flex-col gap-2 px-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`inline-flex items-center px-4 py-3 rounded-2xl font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400
                  ${isActive ? "text-blue-700 dark:text-blue-400 underline underline-offset-8 decoration-2 decoration-blue-400 dark:decoration-blue-500 bg-blue-50/60 dark:bg-blue-900/40 shadow-sm" : "text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-900 hover:text-blue-700 dark:hover:text-blue-300"}
                `}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
} 