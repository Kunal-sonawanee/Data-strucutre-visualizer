import type { Metadata } from "next"
import VisualizerTabs from "@/components/visualizer/visualizer-tabs"

export const metadata: Metadata = {
  title: "Data Structure Visualizer",
  description: "Interactive visualizations of common data structures and algorithms",
}

export default function VisualizerPage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Data Structure Visualizer</h1>
        <p className="text-muted-foreground">
          Explore and interact with various data structures through visual representations.
        </p>
      </div>

      <VisualizerTabs />
    </div>
  )
}

