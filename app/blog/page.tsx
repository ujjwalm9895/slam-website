import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const posts = [
  {
    title: "SLAM Robotics launches first prototype",
    date: "2024-06-01",
    content: "We are excited to announce the launch of our first SLAM-enabled robot prototype, setting a new standard for autonomous navigation!",
  },
  {
    title: "Seed funding secured",
    date: "2024-05-15",
    content: "We have closed our seed round, raising $1M to accelerate R&D and bring our vision to life. Thank you to our investors!",
  },
  {
    title: "Team grows with new hires",
    date: "2024-05-01",
    content: "Welcoming talented engineers and innovators to the SLAM Robotics team as we expand our capabilities.",
  },
];

export default function BlogPage() {
  return (
    <main className="max-w-3xl mx-auto py-12 px-4 flex flex-col gap-8">
      {posts.map((post) => (
        <Card key={post.title}>
          <CardHeader>
            <CardTitle>{post.title}</CardTitle>
            <div className="text-xs text-muted-foreground">{post.date}</div>
          </CardHeader>
          <CardContent>
            <p>{post.content}</p>
          </CardContent>
        </Card>
      ))}
    </main>
  );
} 