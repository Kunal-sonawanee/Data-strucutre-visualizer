import type { Metadata } from "next"
import CollaborationRoom from "@/components/collaboration/collaboration-room"

export const metadata: Metadata = {
  title: "Real-Time Collaboration",
  description: "Collaborate with others on data structures and algorithms in real-time",
}

export default function CollaboratePage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Real-Time Collaboration</h1>
        <p className="text-muted-foreground">
          Work together with others to solve problems and visualize data structures in real-time.
        </p>
      </div>

      <CollaborationRoom />
    </div>
  )
}

