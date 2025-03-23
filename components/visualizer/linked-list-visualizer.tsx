"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Plus, Minus, Search, RotateCcw, ArrowRight } from "lucide-react"

interface Node {
  value: number
  id: string
}

export default function LinkedListVisualizer() {
  const [nodes, setNodes] = useState<Node[]>([])
  const [value, setValue] = useState("")
  const [position, setPosition] = useState("")
  const [searchValue, setSearchValue] = useState("")
  const [currentIndex, setCurrentIndex] = useState<number | null>(null)
  const [targetIndex, setTargetIndex] = useState<number | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(50)
  const [message, setMessage] = useState("")

  useEffect(() => {
    // Initialize with some random values
    generateRandomList()
  }, [])

  const generateRandomList = () => {
    const size = Math.floor(Math.random() * 6) + 3 // 3-8 elements
    const newNodes = Array.from({ length: size }, () => ({
      value: Math.floor(Math.random() * 100),
      id: Math.random().toString(36).substring(2, 9),
    }))
    setNodes(newNodes)
    setCurrentIndex(null)
    setTargetIndex(null)
    setMessage("")
  }

  const handleAddNode = () => {
    if (value === "") return

    const numValue = Number.parseInt(value)
    if (isNaN(numValue)) return

    const pos = position === "" ? nodes.length : Number.parseInt(position)
    if (pos < 0 || pos > nodes.length) {
      setMessage("Invalid position")
      return
    }

    setIsAnimating(true)

    // Animate traversal to the insertion point
    animateTraversal(pos, () => {
      const newNode = { value: numValue, id: Math.random().toString(36).substring(2, 9) }
      const newNodes = [...nodes]
      newNodes.splice(pos, 0, newNode)

      setNodes(newNodes)
      setTargetIndex(pos)
      setMessage(`Added node with value ${numValue} at position ${pos}`)

      setTimeout(() => {
        setTargetIndex(null)
        setIsAnimating(false)
      }, 1000)
    })

    setValue("")
    setPosition("")
  }

  const handleRemoveNode = () => {
    if (position === "") return

    const pos = Number.parseInt(position)
    if (pos < 0 || pos >= nodes.length) {
      setMessage("Invalid position")
      return
    }

    setIsAnimating(true)

    // Animate traversal to the removal point
    animateTraversal(pos, () => {
      setTargetIndex(pos)

      setTimeout(() => {
        const newNodes = [...nodes]
        newNodes.splice(pos, 1)
        setNodes(newNodes)
        setMessage(`Removed node at position ${pos}`)
        setTargetIndex(null)
        setIsAnimating(false)
      }, 500)
    })

    setPosition("")
  }

  const handleSearch = () => {
    if (searchValue === "") return

    const numValue = Number.parseInt(searchValue)
    if (isNaN(numValue)) return

    setIsAnimating(true)
    setMessage("Searching...")

    let found = false
    animateTraversal(
      nodes.length,
      (index) => {
        if (nodes[index].value === numValue) {
          found = true
          setTargetIndex(index)
          setMessage(`Found value ${numValue} at position ${index}`)

          setTimeout(() => {
            setTargetIndex(null)
            setIsAnimating(false)
          }, 1500)

          return true // Stop traversal
        }
        return false // Continue traversal
      },
      () => {
        if (!found) {
          setMessage(`Value ${numValue} not found in the linked list`)
          setIsAnimating(false)
        }
      },
    )

    setSearchValue("")
  }

  const animateTraversal = (targetPos: number, onComplete: () => void, onStep?: (index: number) => boolean) => {
    let currentPos = 0
    setCurrentIndex(0)

    const traverse = () => {
      if (currentPos >= targetPos || currentPos >= nodes.length) {
        setCurrentIndex(null)
        onComplete()
        return
      }

      if (onStep && onStep(currentPos)) {
        return // Stop if onStep returns true
      }

      currentPos++
      setCurrentIndex(currentPos)

      setTimeout(traverse, 1000 - animationSpeed * 9)
    }

    setTimeout(traverse, 1000 - animationSpeed * 9)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Linked List Visualization</h3>
              <Button variant="outline" size="sm" onClick={generateRandomList} disabled={isAnimating}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-1 min-h-[200px]">
              {nodes.map((node, idx) => (
                <div key={node.id} className="flex items-center">
                  <div
                    className={`
                      flex flex-col items-center justify-center
                      w-16 h-16 rounded-full border-2 border-primary
                      transition-all duration-300
                      ${idx === currentIndex ? "bg-blue-100 dark:bg-blue-900 border-blue-500" : ""}
                      ${idx === targetIndex ? "bg-green-100 dark:bg-green-900 border-green-500 scale-110" : ""}
                    `}
                  >
                    <span className="font-bold">{node.value}</span>
                    <span className="text-xs text-muted-foreground">pos: {idx}</span>
                  </div>

                  {idx < nodes.length - 1 && <ArrowRight className="h-6 w-6 mx-1 text-muted-foreground" />}
                </div>
              ))}

              {nodes.length === 0 && <div className="text-muted-foreground">Linked list is empty</div>}
            </div>

            {message && <div className="mt-4 p-2 rounded bg-muted text-center">{message}</div>}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="value-input">Value</Label>
              <Input
                id="value-input"
                type="number"
                placeholder="Enter a value"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                disabled={isAnimating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position-input">Position</Label>
              <Input
                id="position-input"
                type="number"
                placeholder="Enter a position (optional)"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                disabled={isAnimating}
              />
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleAddNode} disabled={isAnimating || value === ""} className="flex-1">
                <Plus className="h-4 w-4 mr-2" />
                Add Node
              </Button>
              <Button
                onClick={handleRemoveNode}
                disabled={isAnimating || position === "" || nodes.length === 0}
                variant="destructive"
                className="flex-1"
              >
                <Minus className="h-4 w-4 mr-2" />
                Remove
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="search-input">Search</Label>
              <div className="flex space-x-2">
                <Input
                  id="search-input"
                  type="number"
                  placeholder="Value to search"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  disabled={isAnimating}
                />
                <Button
                  onClick={handleSearch}
                  disabled={isAnimating || searchValue === "" || nodes.length === 0}
                  variant="outline"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

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
          <h3 className="text-lg font-medium mb-4">Linked List Operations</h3>
          <div className="space-y-2">
            <p>
              <strong>Insert:</strong> Add a node at a specific position (or at the end if no position is provided).
            </p>
            <p>
              <strong>Remove:</strong> Delete a node at the specified position.
            </p>
            <p>
              <strong>Search:</strong> Find a node with a specific value in the linked list.
            </p>
            <p>
              <strong>Time Complexity:</strong>
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Access: O(n) - Must traverse from head to reach a specific position</li>
              <li>Search: O(n) - Must traverse to find an element</li>
              <li>Insert/Remove at beginning: O(1) - Constant time operation</li>
              <li>Insert/Remove at middle/end: O(n) - Must traverse to the position first</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

