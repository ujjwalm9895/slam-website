"use client";
import { useState, useRef } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('loading');
    setError('');
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const linkedin = formData.get('linkedin') as string;
    const message = formData.get('message') as string;
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, linkedin, message })
      });
      const data = await res.json();
      if (data.success) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
        setError(data.error || 'Failed to send message.');
      }
    } catch (e) {
      setStatus('error');
      setError('Network error. Please try again.');
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
          {status === 'success' && (
            <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-green-800 dark:text-green-200 text-center">
                ✅ Message sent successfully! We'll get back to you soon.
              </p>
            </div>
          )}
          {status === 'error' && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-800 dark:text-red-200 text-center">
                ❌ {error}
              </p>
            </div>
          )}
          <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-5 animate-fade-in">
            <input 
              type="text" 
              name="name" 
              placeholder="Your Name" 
              required 
              className="rounded-lg border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-blue-400 focus-visible:ring-2 focus-visible:ring-blue-400"
            />
            <input 
              type="email" 
              name="email" 
              placeholder="Your Email" 
              required 
              className="rounded-lg border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-blue-400 focus-visible:ring-2 focus-visible:ring-blue-400"
            />
            <input 
              type="url" 
              name="linkedin" 
              placeholder="LinkedIn Profile (optional)" 
              className="rounded-lg border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-blue-400 focus-visible:ring-2 focus-visible:ring-blue-400"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              required
              className="h-24 rounded-lg border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-blue-400 focus-visible:ring-2 focus-visible:ring-blue-400"
            />
            <button 
              type="submit" 
              disabled={status === 'loading'}
              className="rounded-2xl bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white shadow hover:shadow-lg transition-all text-lg py-3"
            >
              {status === 'loading' ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
} 