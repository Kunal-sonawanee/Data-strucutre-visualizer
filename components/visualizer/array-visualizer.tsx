"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Play, Plus, Minus, Search, SortAsc, SortDesc, Shuffle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ArrayVisualizer() {
  const [array, setArray] = useState<number[]>([])
  const [value, setValue] = useState("")
  const [index, setIndex] = useState("")
  const [searchValue, setSearchValue] = useState("")
  const [currentIndex, setCurrentIndex] = useState<number | null>(null)
  const [targetIndex, setTargetIndex] = useState<number | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(50)
  const [algorithm, setAlgorithm] = useState("insertion")
  const [sortDirection, setSortDirection] = useState("asc")
  const [message, setMessage] = useState("")

  useEffect(() => {
    // Initialize with some random values
    generateRandomArray()
  }, [])

  const generateRandomArray = () => {
    const size = Math.floor(Math.random() * 10) + 5 // 5-15 elements
    const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 100))
    setArray(newArray)
    setCurrentIndex(null)
    setTargetIndex(null)
    setMessage("")
  }

  const handleAdd = () => {
    if (value === "") return

    const numValue = Number.parseInt(value)
    if (isNaN(numValue)) return

    const position = index === "" ? array.length : Number.parseInt(index)
    if (position < 0 || position > array.length) {
      setMessage("Invalid index")
      return
    }

    const newArray = [...array]
    newArray.splice(position, 0, numValue)

    animateInsertion(newArray, position)
    setValue("")
    setIndex("")
  }

  const handleRemove = () => {
    if (index === "") return

    const position = Number.parseInt(index)
    if (position < 0 || position >= array.length) {
      setMessage("Invalid index")
      return
    }

    const newArray = [...array]
    newArray.splice(position, 1)

    setTargetIndex(position)
    setTimeout(() => {
      setArray(newArray)
      setTargetIndex(null)
      setMessage(`Removed element at index ${position}`)
    }, 500)

    setIndex("")
  }

  const handleSearch = () => {
    if (searchValue === "") return

    const numValue = Number.parseInt(searchValue)
    if (isNaN(numValue)) return

    setIsAnimating(true)
    setMessage("Searching...")

    let i = 0
    const searchInterval = setInterval(
      () => {
        if (i >= array.length) {
          clearInterval(searchInterval)
          setCurrentIndex(null)
          setIsAnimating(false)
          setMessage(`Element ${numValue} not found`)
          return
        }

        setCurrentIndex(i)

        if (array[i] === numValue) {
          clearInterval(searchInterval)
          setTargetIndex(i)
          setIsAnimating(false)
          setMessage(`Found ${numValue} at index ${i}`)
          setTimeout(() => {
            setTargetIndex(null)
          }, 2000)
          return
        }

        i++
      },
      1000 - animationSpeed * 9,
    )

    setSearchValue("")
  }

  const animateInsertion = (newArray: number[], position: number) => {
    setIsAnimating(true)
    setTargetIndex(position)

    setTimeout(() => {
      setArray(newArray)
      setMessage(`Added ${newArray[position]} at index ${position}`)

      setTimeout(() => {
        setTargetIndex(null)
        setIsAnimating(false)
      }, 1000)
    }, 500)
  }

  const handleSort = () => {
    if (isAnimating) return

    setIsAnimating(true)
    setMessage(`Sorting using ${algorithm} sort...`)

    // Clone the array to avoid mutating the original during animation
    const arrCopy = [...array]

    if (algorithm === "bubble") {
      bubbleSort(arrCopy)
    } else if (algorithm === "insertion") {
      insertionSort(arrCopy)
    } else if (algorithm === "selection") {
      selectionSort(arrCopy)
    }
  }

  const bubbleSort = async (arr: number[]) => {
    const n = arr.length
    const delay = 1000 - animationSpeed * 9

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        setCurrentIndex(j)
        setTargetIndex(j + 1)

        // Wait for visualization
        await new Promise((resolve) => setTimeout(resolve, delay))

        const shouldSwap = sortDirection === "asc" ? arr[j] > arr[j + 1] : arr[j] < arr[j + 1]

        if (shouldSwap) {
          // Swap elements
          ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
          setArray([...arr])

          // Wait after swap
          await new Promise((resolve) => setTimeout(resolve, delay))
        }
      }
    }

    finishSorting()
  }

  const insertionSort = async (arr: number[]) => {
    const n = arr.length
    const delay = 1000 - animationSpeed * 9

    for (let i = 1; i < n; i++) {
      const key = arr[i]
      let j = i - 1

      setCurrentIndex(i)
      await new Promise((resolve) => setTimeout(resolve, delay))

      while (j >= 0 && (sortDirection === "asc" ? arr[j] > key : arr[j] < key)) {
        setTargetIndex(j)
        arr[j + 1] = arr[j]
        j--

        setArray([...arr])
        await new Promise((resolve) => setTimeout(resolve, delay))
      }

      arr[j + 1] = key
      setArray([...arr])
      await new Promise((resolve) => setTimeout(resolve, delay))
    }

    finishSorting()
  }

  const selectionSort = async (arr: number[]) => {
    const n = arr.length
    const delay = 1000 - animationSpeed * 9

    for (let i = 0; i < n; i++) {
      let minIdx = i
      setCurrentIndex(i)

      for (let j = i + 1; j < n; j++) {
        setTargetIndex(j)
        await new Promise((resolve) => setTimeout(resolve, delay))

        const shouldUpdate = sortDirection === "asc" ? arr[j] < arr[minIdx] : arr[j] > arr[minIdx]

        if (shouldUpdate) {
          minIdx = j
        }
      }

      if (minIdx !== i) {
        ;[arr[i], arr[minIdx]] = [arr[minIdx], arr[i]]
        setArray([...arr])
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }

    finishSorting()
  }

  const finishSorting = () => {
    setCurrentIndex(null)
    setTargetIndex(null)
    setIsAnimating(false)
    setMessage("Sorting complete")
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Array Visualization</h3>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" onClick={generateRandomArray} disabled={isAnimating}>
                  <Shuffle className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))
                  }}
                >
                  {sortDirection === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 min-h-[200px] items-center justify-center">
              {array.map((num, idx) => (
                <div
                  key={idx}
                  className={`
                    flex items-center justify-center
                    w-12 h-12 rounded border text-center
                    transition-all duration-300
                    ${idx === currentIndex ? "bg-blue-100 dark:bg-blue-900 border-blue-500" : ""}
                    ${idx === targetIndex ? "bg-green-100 dark:bg-green-900 border-green-500 scale-110" : ""}
                  `}
                >
                  {num}
                </div>
              ))}
              {array.length === 0 && <div className="text-muted-foreground">Array is empty</div>}
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
              <Label htmlFor="index-input">Index</Label>
              <Input
                id="index-input"
                type="number"
                placeholder="Enter an index (optional)"
                value={index}
                onChange={(e) => setIndex(e.target.value)}
                disabled={isAnimating}
              />
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleAdd} disabled={isAnimating || value === ""} className="flex-1">
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
              <Button
                onClick={handleRemove}
                disabled={isAnimating || index === "" || array.length === 0}
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
                  disabled={isAnimating || searchValue === "" || array.length === 0}
                  variant="outline"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Sort Algorithm</Label>
              <Select value={algorithm} onValueChange={setAlgorithm} disabled={isAnimating}>
                <SelectTrigger>
                  <SelectValue placeholder="Select algorithm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bubble">Bubble Sort</SelectItem>
                  <SelectItem value="insertion">Insertion Sort</SelectItem>
                  <SelectItem value="selection">Selection Sort</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleSort} disabled={isAnimating || array.length <= 1} className="w-full">
              <Play className="h-4 w-4 mr-2" />
              Sort
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
          <h3 className="text-lg font-medium mb-4">Array Operations</h3>
          <div className="space-y-2">
            <p>
              <strong>Insert:</strong> Add an element at a specific index (or at the end if no index is provided).
            </p>
            <p>
              <strong>Remove:</strong> Delete an element at the specified index.
            </p>
            <p>
              <strong>Search:</strong> Find an element in the array and highlight its position.
            </p>
            <p>
              <strong>Sort:</strong> Arrange elements in ascending or descending order using different algorithms.
            </p>
            <p>
              <strong>Time Complexity:</strong>
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Access: O(1) - Constant time to access any element by index</li>
              <li>Search: O(n) - Linear time to find an element</li>
              <li>Insert/Remove: O(n) - May require shifting elements</li>
              <li>Sort: O(n²) for bubble, insertion, and selection sort</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

