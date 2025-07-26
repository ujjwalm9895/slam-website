"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useRef } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const form = formRef.current;
    if (!form) return;

    const formData = new FormData(form);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      linkedin: formData.get("linkedin"),
      message: formData.get("message"),
    };

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      setSubmitted(true);
      form.reset();
    } else {
      setError("Failed to send message. Please try again later or email us directly.");
    }
  };

  return (
    <main className="max-w-md mx-auto py-10 sm:py-16 px-2 sm:px-4">
      <Card className="rounded-2xl shadow-lg bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl font-bold text-blue-700 dark:text-blue-400 text-center">Contact Us</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 text-center text-gray-700 dark:text-gray-300 text-base">
            Or email us directly at <a href="mailto:slam.robots@gmail.com" className="text-blue-700 dark:text-blue-400 underline">slam.robots@gmail.com</a>
          </div>
          {submitted ? (
            <div className="text-green-600 dark:text-green-400 font-medium text-center py-8 animate-fade-in">
              Thank you! Your message has been sent.
            </div>
          ) : (
            <form
              ref={formRef}
              className="flex flex-col gap-5 animate-fade-in"
              onSubmit={handleSubmit}
            >
              <Input type="text" name="name" placeholder="Your Name" required className="rounded-lg" />
              <Input type="email" name="email" placeholder="Your Email" required className="rounded-lg" />
              <Input type="url" name="linkedin" placeholder="LinkedIn Profile (optional)" className="rounded-lg" />
              <textarea
                name="message"
                placeholder="Your Message"
                required
                className="h-24 rounded-lg border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-blue-400 focus-visible:ring-2 focus-visible:ring-blue-400 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive placeholder:text-muted-foreground"
              />
              <Button type="submit" className="rounded-2xl bg-blue-700 hover:bg-blue-800 text-white shadow hover:shadow-lg transition-all text-lg py-3">
                Send Message
              </Button>
              {error && <div className="text-red-600 dark:text-red-400 text-center mt-2">{error}</div>}
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
} 