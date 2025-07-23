import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function InvestorsPage() {
  return (
    <main className="max-w-2xl mx-auto py-10 sm:py-16 px-2 sm:px-4 flex flex-col gap-12 bg-gradient-to-b from-white via-blue-50 to-blue-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-4 text-blue-700 dark:text-blue-400">Partner in Building the Future</h1>

      {/* Funding Goal */}
      <Card className="text-center rounded-2xl shadow-lg bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-blue-700 dark:text-blue-400">Funding Goal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-2">₹50 Lakhs</div>
        </CardContent>
      </Card>

      {/* Use of Funds & Milestones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="rounded-2xl shadow-lg bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-blue-700 dark:text-blue-400">Use of Funds</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2 text-base text-gray-700 dark:text-gray-200">
              <li>R&amp;D</li>
              <li>Hardware</li>
              <li>Hiring</li>
              <li>Pilots</li>
            </ul>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-lg bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-blue-700 dark:text-blue-400">Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2 text-base text-gray-700 dark:text-gray-200">
              <li>Prototype built</li>
              <li>Field test done</li>
              <li>Team formed</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Pitch Deck Button */}
      <div className="flex flex-col md:flex-row gap-4 justify-center items-center mt-4">
        <Button asChild size="lg" variant="outline" className="rounded-2xl shadow hover:shadow-lg transition">
          <a href="/pitch.pdf" target="_blank" rel="noopener noreferrer">Download Pitch Deck</a>
        </Button>
        <Button asChild size="lg" variant="default" className="rounded-2xl shadow hover:shadow-lg transition">
          <a href="/contact">Contact Us</a>
        </Button>
      </div>
    </main>
  );
} 