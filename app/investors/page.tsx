import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function InvestorsPage() {
  return (
    <main className="max-w-2xl mx-auto py-12 px-4 flex flex-col gap-10">
      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-2">Partner in Building the Future</h1>

      {/* Funding Goal */}
      <Card className="text-center">
        <CardHeader>
          <CardTitle>Funding Goal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary mb-2">₹50 Lakhs</div>
        </CardContent>
      </Card>

      {/* Use of Funds & Milestones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Use of Funds</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1 text-base">
              <li>R&amp;D</li>
              <li>Hardware</li>
              <li>Hiring</li>
              <li>Pilots</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1 text-base">
              <li>Prototype built</li>
              <li>Field test done</li>
              <li>Team formed</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Pitch Deck Button */}
      <div className="flex flex-col md:flex-row gap-4 justify-center items-center mt-4">
        <Button asChild size="lg" variant="outline">
          <a href="/pitch.pdf" target="_blank" rel="noopener noreferrer">Download Pitch Deck</a>
        </Button>
        <Button asChild size="lg" variant="default">
          <a href="/contact">Contact Us</a>
        </Button>
      </div>
    </main>
  );
} 