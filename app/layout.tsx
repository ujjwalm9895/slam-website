import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/components/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SLAM Robotics - Autonomous Navigation Solutions",
  description: "SLAM Robotics specializes in autonomous navigation technology for farming, robotics, and smart automation. Sense. Learn. Act. Move.",
  icons: {
    icon: '/slam-logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-x-hidden`}
      >
        <AuthProvider>
          <Navbar />
          <main className="flex-1 w-full max-w-screen-xl mx-auto flex flex-col min-h-[80vh] px-4 sm:px-6 pt-4 pb-12 gap-8">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
