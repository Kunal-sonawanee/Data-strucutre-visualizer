"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronRight, Trophy, BarChart, Network, ListTree, Hash, Lock } from "lucide-react"

interface Challenge {
  id: string
  title: string
  description: string
  difficulty: "easy" | "medium" | "hard"
  category: string
  icon: React.ReactNode
  completed: boolean
  locked: boolean
}

export default function ChallengesList() {
  const [challenges] = useState<Challenge[]>([
    {
      id: "array-sorting",
      title: "Array Sorting Challenge",
      description: "Implement and analyze different sorting algorithms on arrays of various sizes.",
      difficulty: "easy",
      category: "Arrays",
      icon: <BarChart className="h-8 w-8 text-primary" />,
      completed: true,
      locked: false,
    },
    {
      id: "linked-list-operations",
      title: "Linked List Operations",
      description: "Implement efficient operations on singly and doubly linked lists.",
      difficulty: "medium",
      category: "Linked Lists",
      icon: <ChevronRight className="h-8 w-8 text-primary" />,
      completed: false,
      locked: false,
    },
    {
      id: "binary-tree-traversal",
      title: "Binary Tree Traversal",
      description: "Implement and compare different tree traversal algorithms.",
      difficulty: "medium",
      category: "Trees",
      icon: <ListTree className="h-8 w-8 text-primary" />,
      completed: false,
      locked: false,
    },
    {
      id: "graph-shortest-path",
      title: "Graph Shortest Path",
      description: "Find the shortest path between nodes using different algorithms.",
      difficulty: "hard",
      category: "Graphs",
      icon: <Network className="h-8 w-8 text-primary" />,
      completed: false,
      locked: false,
    },
    {
      id: "hash-table-implementation",
      title: "Hash Table Implementation",
      description: "Build a hash table from scratch and handle collisions efficiently.",
      difficulty: "hard",
      category: "Hash Tables",
      icon: <Hash className="h-8 w-8 text-primary" />,
      completed: false,
      locked: true,
    },
    {
      id: "advanced-algorithms",
      title: "Advanced Algorithms Challenge",
      description: "Solve complex problems using dynamic programming and greedy algorithms.",
      difficulty: "hard",
      category: "Advanced",
      icon: <Trophy className="h-8 w-8 text-primary" />,
      completed: false,
      locked: true,
    },
  ])

  const completedCount = challenges.filter((c) => c.completed).length
  const progressPercentage = (completedCount / challenges.length) * 100

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-500 hover:bg-green-600"
      case "medium":
        return "bg-yellow-500 hover:bg-yellow-600"
      case "hard":
        return "bg-red-500 hover:bg-red-600"
      default:
        return "bg-primary hover:bg-primary/90"
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">Your Progress</h2>
          <div className="flex items-center gap-2 mb-2">
            <Progress value={progressPercentage} className="w-64 h-2" />
            <span className="text-sm font-medium">
              {completedCount}/{challenges.length}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm">Easy</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-sm">Medium</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm">Hard</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map((challenge) => (
          <Card key={challenge.id} className={challenge.locked ? "opacity-75" : ""}>
            <CardHeader>
              <div className="flex justify-between items-start">
                {challenge.icon}
                <Badge className={`${getDifficultyColor(challenge.difficulty)} text-white`}>
                  {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                </Badge>
              </div>
              <CardTitle className="flex items-center gap-2">
                {challenge.title}
                {challenge.locked && <Lock className="h-4 w-4" />}
              </CardTitle>
              <CardDescription>{challenge.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{challenge.category}</Badge>
                {challenge.completed && (
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                  >
                    Completed
                  </Badge>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Link href={challenge.locked ? "#" : `/challenges/${challenge.id}`} className="w-full">
                <Button
                  variant={challenge.locked ? "outline" : "default"}
                  className="w-full"
                  disabled={challenge.locked}
                >
                  {challenge.locked ? "Locked" : "Start Challenge"}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

