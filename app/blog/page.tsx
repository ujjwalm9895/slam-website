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
    <main className="max-w-3xl mx-auto py-10 sm:py-16 px-2 sm:px-4 flex flex-col gap-10 bg-gradient-to-b from-white via-blue-50 to-blue-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-blue-700 dark:text-blue-400 text-center">Latest Updates</h1>
      {posts.map((post) => (
        <Card key={post.title} className="rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-200 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl font-semibold group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">{post.title}</CardTitle>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{post.date}</div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-200 leading-relaxed">{post.content}</p>
          </CardContent>
        </Card>
      ))}
    </main>
  );
} 