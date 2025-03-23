"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ArrayVisualizer from "@/components/visualizer/array-visualizer"
import LinkedListVisualizer from "@/components/visualizer/linked-list-visualizer"
import BinaryTreeVisualizer from "@/components/visualizer/binary-tree-visualizer"
import GraphVisualizer from "@/components/visualizer/graph-visualizer"

export default function VisualizerTabs() {
  const [activeTab, setActiveTab] = useState("array")

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-4 mb-8">
        <TabsTrigger value="array">Array</TabsTrigger>
        <TabsTrigger value="linked-list">Linked List</TabsTrigger>
        <TabsTrigger value="binary-tree">Binary Tree</TabsTrigger>
        <TabsTrigger value="graph">Graph</TabsTrigger>
      </TabsList>

      <TabsContent value="array" className="mt-0">
        <ArrayVisualizer />
      </TabsContent>

      <TabsContent value="linked-list" className="mt-0">
        <LinkedListVisualizer />
      </TabsContent>

      <TabsContent value="binary-tree" className="mt-0">
        <BinaryTreeVisualizer />
      </TabsContent>

      <TabsContent value="graph" className="mt-0">
        <GraphVisualizer />
      </TabsContent>
    </Tabs>
  )
}

