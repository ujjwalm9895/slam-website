"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <main className="max-w-md mx-auto py-10 sm:py-16 px-2 sm:px-4">
      <Card className="rounded-2xl shadow-lg bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl font-bold text-blue-700 dark:text-blue-400 text-center">Contact Us</CardTitle>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="text-green-600 dark:text-green-400 font-medium text-center py-8 animate-fade-in">Thank you for reaching out! We&apos;ll get back to you soon.</div>
          ) : (
            <form
              className="flex flex-col gap-5 animate-fade-in"
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
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
              <Button type="submit" className="rounded-2xl bg-blue-700 hover:bg-blue-800 text-white shadow hover:shadow-lg transition-all text-lg py-3">Send Message</Button>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
} 