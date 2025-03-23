import type { Metadata } from "next"
import ChallengesList from "@/components/challenges/challenges-list"

export const metadata: Metadata = {
  title: "Data Structure Challenges",
  description: "Test your knowledge with interactive data structure challenges",
}

export default function ChallengesPage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Data Structure Challenges</h1>
        <p className="text-muted-foreground">
          Test your knowledge and understanding of data structures and algorithms with these interactive challenges.
        </p>
      </div>

      <ChallengesList />
    </div>
  )
}

