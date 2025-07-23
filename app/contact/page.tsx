"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <main className="max-w-md mx-auto py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="text-green-600 font-medium">Thank you for reaching out! We&apos;ll get back to you soon.</div>
          ) : (
            <form
              className="flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
            >
              <Input type="text" name="name" placeholder="Your Name" required />
              <Input type="email" name="email" placeholder="Your Email" required />
              <Input type="url" name="linkedin" placeholder="LinkedIn Profile (optional)" />
              <textarea
                name="message"
                placeholder="Your Message"
                required
                className="h-24 rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive placeholder:text-muted-foreground"
              />
              <Button type="submit">Send Message</Button>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
} 