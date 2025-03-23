import type { Metadata } from "next"
import CodeEditorComponent from "@/components/code-editor/code-editor"

export const metadata: Metadata = {
  title: "Code Editor",
  description: "Write and test your own data structure implementations",
}

export default function CodeEditorPage() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Code Editor</h1>
        <p className="text-muted-foreground">
          Write, run, and test your own implementations of data structures and algorithms.
        </p>
      </div>

      <CodeEditorComponent />
    </div>
  )
}

