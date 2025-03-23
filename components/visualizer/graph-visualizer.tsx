"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Plus, Minus, RotateCcw, Play } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface GraphNode {
  id: string
  label: string
  x: number
  y: number
  highlighted?: boolean
  visiting?: boolean
}

interface GraphEdge {
  id: string
  source: string
  target: string
  weight: number
  highlighted?: boolean
}

export default function GraphVisualizer() {
  const [nodes, setNodes] = useState<GraphNode[]>([])
  const [edges, setEdges] = useState<GraphEdge[]>([])
  const [sourceNode, setSourceNode] = useState("")
  const [targetNode, setTargetNode] = useState("")
  const [weight, setWeight] = useState("1")
  const [algorithm, setAlgorithm] = useState("bfs")
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(50)
  const [message, setMessage] = useState("")
  const [visitedNodes, setVisitedNodes] = useState<string[]>([])
  const [visitedEdges, setVisitedEdges] = useState<string[]>([])

  const canvasRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const draggedNode = useRef<string | null>(null)

  useEffect(() => {
    generateRandomGraph()
  }, [])

  const generateRandomGraph = () => {
    // Create a random graph with 5-8 nodes and 6-12 edges
    const nodeCount = Math.floor(Math.random() * 4) + 5

    // Create nodes in a circle layout
    const newNodes: GraphNode[] = []
    const radius = 120
    const centerX = 200
    const centerY = 150

    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * 2 * Math.PI
      newNodes.push({
        id: String.fromCharCode(65 + i), // A, B, C, ...
        label: String.fromCharCode(65 + i),
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      })
    }

    // Create random edges
    const newEdges: GraphEdge[] = []
    const edgeCount = Math.floor(Math.random() * 7) + 6

    for (let i = 0; i < edgeCount; i++) {
      const source = newNodes[Math.floor(Math.random() * nodeCount)].id
      let target = newNodes[Math.floor(Math.random() * nodeCount)].id

      // Avoid self-loops and duplicate edges
      while (
        source === target ||
        newEdges.some(
          (e) => (e.source === source && e.target === target) || (e.source === target && e.target === source),
        )
      ) {
        target = newNodes[Math.floor(Math.random() * nodeCount)].id
      }

      newEdges.push({
        id: `${source}-${target}`,
        source,
        target,
        weight: Math.floor(Math.random() * 9) + 1,
      })
    }

    setNodes(newNodes)
    setEdges(newEdges)
    setVisitedNodes([])
    setVisitedEdges([])
    setMessage("")
  }

  const handleAddNode = () => {
    if (nodes.length >= 26) {
      setMessage("Maximum number of nodes reached")
      return
    }

    // Generate next available letter
    const nextLetter = String.fromCharCode(65 + nodes.length)

    // Place new node in the center
    const newNode: GraphNode = {
      id: nextLetter,
      label: nextLetter,
      x: 200,
      y: 150,
      highlighted: true,
    }

    setNodes([...nodes, newNode])
    setMessage(`Added node ${nextLetter}`)

    setTimeout(() => {
      setNodes((prev) =>
        prev.map((node) => ({
          ...node,
          highlighted: false,
        })),
      )
    }, 1000)
  }

  const handleAddEdge = () => {
    if (sourceNode === "" || targetNode === "") {
      setMessage("Please select source and target nodes")
      return
    }

    if (sourceNode === targetNode) {
      setMessage("Self-loops are not allowed")
      return
    }

    const edgeExists = edges.some(
      (e) =>
        (e.source === sourceNode && e.target === targetNode) || (e.source === targetNode && e.target === sourceNode),
    )

    if (edgeExists) {
      setMessage("Edge already exists")
      return
    }

    const weightValue = Number.parseInt(weight)
    if (isNaN(weightValue) || weightValue <= 0) {
      setMessage("Weight must be a positive number")
      return
    }

    const newEdge: GraphEdge = {
      id: `${sourceNode}-${targetNode}`,
      source: sourceNode,
      target: targetNode,
      weight: weightValue,
      highlighted: true,
    }

    setEdges([...edges, newEdge])
    setMessage(`Added edge from ${sourceNode} to ${targetNode} with weight ${weightValue}`)

    setTimeout(() => {
      setEdges((prev) =>
        prev.map((edge) => ({
          ...edge,
          highlighted: false,
        })),
      )
    }, 1000)

    setSourceNode("")
    setTargetNode("")
    setWeight("1")
  }

  const handleRemoveNode = () => {
    if (sourceNode === "") {
      setMessage("Please select a node to remove")
      return
    }

    // Remove the node
    const newNodes = nodes.filter((node) => node.id !== sourceNode)

    // Remove all edges connected to this node
    const newEdges = edges.filter((edge) => edge.source !== sourceNode && edge.target !== sourceNode)

    setNodes(newNodes)
    setEdges(newEdges)
    setMessage(`Removed node ${sourceNode} and all connected edges`)

    setSourceNode("")
  }

  const handleRemoveEdge = () => {
    if (sourceNode === "" || targetNode === "") {
      setMessage("Please select source and target nodes")
      return
    }

    const edgeIndex = edges.findIndex(
      (e) =>
        (e.source === sourceNode && e.target === targetNode) || (e.source === targetNode && e.target === sourceNode),
    )

    if (edgeIndex === -1) {
      setMessage("Edge does not exist")
      return
    }

    const newEdges = [...edges]
    newEdges.splice(edgeIndex, 1)

    setEdges(newEdges)
    setMessage(`Removed edge between ${sourceNode} and ${targetNode}`)

    setSourceNode("")
    setTargetNode("")
  }

  const handleRunAlgorithm = () => {
    if (sourceNode === "") {
      setMessage("Please select a start node")
      return
    }

    setIsAnimating(true)
    setVisitedNodes([])
    setVisitedEdges([])

    if (algorithm === "bfs") {
      setMessage(`Running Breadth-First Search from ${sourceNode}...`)
      runBFS()
    } else if (algorithm === "dfs") {
      setMessage(`Running Depth-First Search from ${sourceNode}...`)
      runDFS()
    } else if (algorithm === "dijkstra") {
      if (targetNode === "") {
        setMessage("Please select a target node for Dijkstra's algorithm")
        setIsAnimating(false)
        return
      }
      setMessage(`Finding shortest path from ${sourceNode} to ${targetNode}...`)
      runDijkstra()
    }
  }

  const runBFS = () => {
    const visited: Set<string> = new Set()
    const queue: string[] = [sourceNode]
    const traversalOrder: string[] = []
    const edgeOrder: string[] = []

    visited.add(sourceNode)

    while (queue.length > 0) {
      const current = queue.shift()!
      traversalOrder.push(current)

      // Find all adjacent nodes
      const adjacentEdges = edges.filter((edge) => edge.source === current || edge.target === current)

      for (const edge of adjacentEdges) {
        const neighbor = edge.source === current ? edge.target : edge.source

        if (!visited.has(neighbor)) {
          visited.add(neighbor)
          queue.push(neighbor)
          edgeOrder.push(edge.id)
        }
      }
    }

    animateTraversal(traversalOrder, edgeOrder)
  }

  const runDFS = () => {
    const visited: Set<string> = new Set()
    const traversalOrder: string[] = []
    const edgeOrder: string[] = []

    const dfs = (node: string) => {
      visited.add(node)
      traversalOrder.push(node)

      // Find all adjacent nodes
      const adjacentEdges = edges.filter((edge) => edge.source === node || edge.target === node)

      for (const edge of adjacentEdges) {
        const neighbor = edge.source === node ? edge.target : edge.source

        if (!visited.has(neighbor)) {
          edgeOrder.push(edge.id)
          dfs(neighbor)
        }
      }
    }

    dfs(sourceNode)
    animateTraversal(traversalOrder, edgeOrder)
  }

  const runDijkstra = () => {
    // Create adjacency list
    const graph: Record<string, { node: string; weight: number }[]> = {}

    for (const node of nodes) {
      graph[node.id] = []
    }

    for (const edge of edges) {
      graph[edge.source].push({ node: edge.target, weight: edge.weight })
      graph[edge.target].push({ node: edge.source, weight: edge.weight }) // For undirected graph
    }

    // Initialize distances
    const distances: Record<string, number> = {}
    const previous: Record<string, string | null> = {}
    const unvisited: Set<string> = new Set()

    for (const node of nodes) {
      distances[node.id] = node.id === sourceNode ? 0 : Number.POSITIVE_INFINITY
      previous[node.id] = null
      unvisited.add(node.id)
    }

    const traversalOrder: string[] = []
    const edgeOrder: string[] = []

    while (unvisited.size > 0) {
      // Find node with minimum distance
      let current: string | null = null
      let minDistance = Number.POSITIVE_INFINITY

      for (const nodeId of unvisited) {
        if (distances[nodeId] < minDistance) {
          minDistance = distances[nodeId]
          current = nodeId
        }
      }

      if (current === null || distances[current] === Number.POSITIVE_INFINITY) {
        break // No path to remaining nodes
      }

      traversalOrder.push(current)

      if (current === targetNode) {
        break // Found target
      }

      unvisited.delete(current)

      // Update distances to neighbors
      for (const { node: neighbor, weight } of graph[current]) {
        if (!unvisited.has(neighbor)) continue

        const alt = distances[current] + weight

        if (alt < distances[neighbor]) {
          distances[neighbor] = alt
          previous[neighbor] = current

          // Find the edge between current and neighbor
          const edge = edges.find(
            (e) => (e.source === current && e.target === neighbor) || (e.source === neighbor && e.target === current),
          )

          if (edge) {
            edgeOrder.push(edge.id)
          }
        }
      }
    }

    // Reconstruct path
    if (previous[targetNode] !== null) {
      const path: string[] = []
      let current = targetNode

      while (current !== null) {
        path.unshift(current)
        current = previous[current] || null
      }

      animateTraversal(traversalOrder, edgeOrder, () => {
        setMessage(
          `Shortest path from ${sourceNode} to ${targetNode}: ${path.join(" → ")} (Distance: ${distances[targetNode]})`,
        )
      })
    } else {
      animateTraversal(traversalOrder, edgeOrder, () => {
        setMessage(`No path found from ${sourceNode} to ${targetNode}`)
      })
    }
  }

  const animateTraversal = (nodeOrder: string[], edgeOrder: string[], onComplete?: () => void) => {
    let nodeIndex = 0
    let edgeIndex = 0

    const animate = () => {
      if (nodeIndex < nodeOrder.length) {
        setVisitedNodes((prev) => [...prev, nodeOrder[nodeIndex]])
        nodeIndex++
        setTimeout(animate, 1000 - animationSpeed * 9)
      } else if (edgeIndex < edgeOrder.length) {
        setVisitedEdges((prev) => [...prev, edgeOrder[edgeIndex]])
        edgeIndex++
        setTimeout(animate, 1000 - animationSpeed * 9)
      } else {
        setIsAnimating(false)
        if (onComplete) {
          onComplete()
        } else {
          setMessage(`${algorithm.toUpperCase()} traversal complete`)
        }
      }
    }

    animate()
  }

  const handleMouseDown = (nodeId: string) => (e: React.MouseEvent) => {
    if (isAnimating) return

    isDragging.current = true
    draggedNode.current = nodeId
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !draggedNode.current || isAnimating) return

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setNodes((prev) => prev.map((node) => (node.id === draggedNode.current ? { ...node, x, y } : node)))
  }

  const handleMouseUp = () => {
    isDragging.current = false
    draggedNode.current = null
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Graph Visualization</h3>
              <Button variant="outline" size="sm" onClick={generateRandomGraph} disabled={isAnimating}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>

            <div
              ref={canvasRef}
              className="relative w-full h-[300px] border rounded-md p-4 overflow-hidden"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {/* Edges */}
              {edges.map((edge) => {
                const sourceNode = nodes.find((n) => n.id === edge.source)
                const targetNode = nodes.find((n) => n.id === edge.target)

                if (!sourceNode || !targetNode) return null

                const midX = (sourceNode.x + targetNode.x) / 2
                const midY = (sourceNode.y + targetNode.y) / 2

                return (
                  <div key={edge.id}>
                    <div
                      className={`
                        absolute border-2 rounded
                        transition-colors duration-300
                        ${edge.highlighted ? "border-green-500" : "border-muted-foreground"}
                        ${visitedEdges.includes(edge.id) ? "border-blue-500" : ""}
                      `}
                      style={{
                        left: sourceNode.x,
                        top: sourceNode.y,
                        width: Math.sqrt(
                          Math.pow(targetNode.x - sourceNode.x, 2) + Math.pow(targetNode.y - sourceNode.y, 2),
                        ),
                        height: "0px",
                        transform: `rotate(${Math.atan2(targetNode.y - sourceNode.y, targetNode.x - sourceNode.x)}rad)`,
                        transformOrigin: "0 0",
                      }}
                    />

                    {/* Edge weight */}
                    <div
                      className="absolute bg-background px-1 rounded-full text-xs"
                      style={{
                        left: midX,
                        top: midY,
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      {edge.weight}
                    </div>
                  </div>
                )
              })}

              {/* Nodes */}
              {nodes.map((node) => (
                <div
                  key={node.id}
                  className={`
                    absolute flex items-center justify-center
                    w-10 h-10 rounded-full border-2 border-primary
                    cursor-move select-none
                    transition-all duration-300
                    ${node.highlighted ? "bg-green-100 dark:bg-green-900 border-green-500" : ""}
                    ${visitedNodes.includes(node.id) ? "bg-blue-100 dark:bg-blue-900 border-blue-500" : ""}
                  `}
                  style={{
                    left: node.x,
                    top: node.y,
                    transform: "translate(-50%, -50%)",
                  }}
                  onMouseDown={handleMouseDown(node.id)}
                >
                  {node.label}
                </div>
              ))}
            </div>

            {message && <div className="mt-4 p-2 rounded bg-muted text-center">{message}</div>}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex space-x-2">
              <Button onClick={handleAddNode} disabled={isAnimating || nodes.length >= 26} className="flex-1">
                <Plus className="h-4 w-4 mr-2" />
                Add Node
              </Button>
              <Button
                onClick={handleRemoveNode}
                disabled={isAnimating || sourceNode === "" || nodes.length === 0}
                variant="destructive"
                className="flex-1"
              >
                <Minus className="h-4 w-4 mr-2" />
                Remove Node
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Source Node</Label>
              <Select value={sourceNode} onValueChange={setSourceNode} disabled={isAnimating || nodes.length === 0}>
                <SelectTrigger>
                  <SelectValue placeholder="Select node" />
                </SelectTrigger>
                <SelectContent>
                  {nodes.map((node) => (
                    <SelectItem key={node.id} value={node.id}>
                      Node {node.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Target Node</Label>
              <Select value={targetNode} onValueChange={setTargetNode} disabled={isAnimating || nodes.length === 0}>
                <SelectTrigger>
                  <SelectValue placeholder="Select node" />
                </SelectTrigger>
                <SelectContent>
                  {nodes.map((node) => (
                    <SelectItem key={node.id} value={node.id}>
                      Node {node.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight-input">Edge Weight</Label>
              <Input
                id="weight-input"
                type="number"
                min="1"
                placeholder="Enter weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                disabled={isAnimating}
              />
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={handleAddEdge}
                disabled={isAnimating || sourceNode === "" || targetNode === ""}
                className="flex-1"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Edge
              </Button>
              <Button
                onClick={handleRemoveEdge}
                disabled={isAnimating || sourceNode === "" || targetNode === ""}
                variant="destructive"
                className="flex-1"
              >
                <Minus className="h-4 w-4 mr-2" />
                Remove Edge
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Algorithm</Label>
              <Select value={algorithm} onValueChange={setAlgorithm} disabled={isAnimating}>
                <SelectTrigger>
                  <SelectValue placeholder="Select algorithm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bfs">Breadth-First Search</SelectItem>
                  <SelectItem value="dfs">Depth-First Search</SelectItem>
                  <SelectItem value="dijkstra">Dijkstra's Algorithm</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleRunAlgorithm}
              disabled={isAnimating || sourceNode === "" || nodes.length === 0}
              className="w-full"
            >
              <Play className="h-4 w-4 mr-2" />
              Run Algorithm
            </Button>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Animation Speed</Label>
                <span>{animationSpeed}%</span>
              </div>
              <Slider
                value={[animationSpeed]}
                onValueChange={(value) => setAnimationSpeed(value[0])}
                min={10}
                max={100}
                step={10}
                disabled={isAnimating}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Graph Operations and Algorithms</h3>
          <div className="space-y-2">
            <p>
              <strong>Breadth-First Search (BFS):</strong> Explores all neighbors at the present depth before moving to
              nodes at the next depth level.
            </p>
            <p>
              <strong>Depth-First Search (DFS):</strong> Explores as far as possible along each branch before
              backtracking.
            </p>
            <p>
              <strong>Dijkstra's Algorithm:</strong> Finds the shortest path between nodes in a graph with non-negative
              edge weights.
            </p>
            <p>
              <strong>Time Complexity:</strong>
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>BFS/DFS: O(V + E) where V is the number of vertices and E is the number of edges</li>
              <li>Dijkstra's Algorithm: O(V²) with an adjacency matrix, O(E + V log V) with a priority queue</li>
              <li>Space Complexity: O(V) for all algorithms to store visited nodes</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

