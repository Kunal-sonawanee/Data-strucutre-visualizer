import Link from "next/link"
import { ArrowRight, BookOpen, Code, Trophy, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Interactive Data Structure Visualizer
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Learn, visualize, and master data structures and algorithms through interactive visualizations and
                challenges.
              </p>
            </div>
            <div className="space-x-4">
              <Link href="/visualizer">
                <Button className="px-8">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/challenges">
                <Button variant="outline" className="px-8">
                  Try Challenges
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <BookOpen className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Interactive Learning</CardTitle>
                <CardDescription>
                  Visualize data structures and algorithms with step-by-step animations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Understand complex concepts through interactive visualizations that bring data structures to life.
                </p>
              </CardContent>
              <CardFooter>
                <Link href="/visualizer">
                  <Button variant="ghost">Explore Visualizations</Button>
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <Users className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Real-Time Collaboration</CardTitle>
                <CardDescription>Work together with peers on the same data structure in real-time.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Solve problems collaboratively, share insights, and learn from others in a shared workspace.</p>
              </CardContent>
              <CardFooter>
                <Link href="/collaborate">
                  <Button variant="ghost">Start Collaborating</Button>
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <Trophy className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Gamification</CardTitle>
                <CardDescription>Complete challenges, earn points, and climb the leaderboard.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Make learning fun with gamified challenges that test your understanding of data structures.</p>
              </CardContent>
              <CardFooter>
                <Link href="/challenges">
                  <Button variant="ghost">View Challenges</Button>
                </Link>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <Code className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Code Execution</CardTitle>
                <CardDescription>Write and test your own implementations in multiple languages.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Practice coding data structures and algorithms with real-time feedback and visualization.</p>
              </CardContent>
              <CardFooter>
                <Link href="/code-editor">
                  <Button variant="ghost">Open Code Editor</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Ready to master data structures?</h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
                Join thousands of students and professionals who are improving their algorithmic thinking.
              </p>
            </div>
            <Link href="/visualizer">
              <Button size="lg" className="px-8">
                Start Learning Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

