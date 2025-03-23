"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Download, Upload, Copy, Save, Trash2 } from "lucide-react"

export default function CodeEditorComponent() {
  const [language, setLanguage] = useState("javascript")
  const [code, setCode] = useState(getDefaultCode("javascript"))
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)

  function getDefaultCode(lang: string) {
    switch (lang) {
      case "javascript":
        return `// Binary Search Tree implementation in JavaScript

class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
  }
  
  insert(value) {
    const newNode = new Node(value);
    
    if (this.root === null) {
      this.root = newNode;
      return this;
    }
    
    let current = this.root;
    
    while (true) {
      if (value === current.value) return undefined;
      
      if (value < current.value) {
        if (current.left === null) {
          current.left = newNode;
          return this;
        }
        current = current.left;
      } else {
        if (current.right === null) {
          current.right = newNode;
          return this;
        }
        current = current.right;
      }
    }
  }
  
  find(value) {
    if (this.root === null) return false;
    
    let current = this.root;
    let found = false;
    
    while (current && !found) {
      if (value < current.value) {
        current = current.left;
      } else if (value > current.value) {
        current = current.right;
      } else {
        found = true;
      }
    }
    
    if (!found) return false;
    return current;
  }
  
  // Test the implementation
  static test() {
    const bst = new BinarySearchTree();
    
    // Insert values
    bst.insert(10);
    bst.insert(5);
    bst.insert(15);
    bst.insert(2);
    bst.insert(7);
    bst.insert(13);
    bst.insert(20);
    
    console.log("BST Structure:", JSON.stringify(bst.root, null, 2));
    
    // Test find
    console.log("Find 7:", bst.find(7) ? "Found" : "Not found");
    console.log("Find 25:", bst.find(25) ? "Found" : "Not found");
    
    return "Binary Search Tree implementation test complete!";
  }
}

// Run the test
const result = BinarySearchTree.test();
console.log(result);`
      case "python":
        return `# Binary Search Tree implementation in Python

class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

class BinarySearchTree:
    def __init__(self):
        self.root = None
    
    def insert(self, value):
        new_node = Node(value)
        
        if self.root is None:
            self.root = new_node
            return self
        
        current = self.root
        
        while True:
            if value == current.value:
                return None
            
            if value < current.value:
                if current.left is None:
                    current.left = new_node
                    return self
                current = current.left
            else:
                if current.right is None:
                    current.right = new_node
                    return self
                current = current.right
    
    def find(self, value):
        if self.root is None:
            return False
        
        current = self.root
        found = False
        
        while current and not found:
            if value < current.value:
                current = current.left
            elif value > current.value:
                current = current.right
            else:
                found = True
        
        if not found:
            return False
        return current
    
    # Helper method to print the tree
    def print_tree(self):
        def print_node(node, level=0):
            if node is not None:
                print_node(node.right, level + 1)
                print(' ' * 4 * level + '->', node.value)
                print_node(node.left, level + 1)
        
        print_node(self.root)

# Test the implementation
def test():
    bst = BinarySearchTree()
    
    # Insert values
    bst.insert(10)
    bst.insert(5)
    bst.insert(15)
    bst.insert(2)
    bst.insert(7)
    bst.insert(13)
    bst.insert(20)
    
    print("BST Structure:")
    bst.print_tree()
    
    # Test find
    print("Find 7:", "Found" if bst.find(7) else "Not found")
    print("Find 25:", "Found" if bst.find(25) else "Not found")
    
    return "Binary Search Tree implementation test complete!"

# Run the test
result = test()
print(result)`
      case "java":
        return `// Binary Search Tree implementation in Java

class Node {
    int value;
    Node left;
    Node right;
    
    Node(int value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

class BinarySearchTree {
    Node root;
    
    BinarySearchTree() {
        this.root = null;
    }
    
    public BinarySearchTree insert(int value) {
        Node newNode = new Node(value);
        
        if (this.root == null) {
            this.root = newNode;
            return this;
        }
        
        Node current = this.root;
        
        while (true) {
            if (value == current.value) return this;
            
            if (value < current.value) {
                if (current.left == null) {
                    current.left = newNode;
                    return this;
                }
                current = current.left;
            } else {
                if (current.right == null) {
                    current.right = newNode;
                    return this;
                }
                current = current.right;
            }
        }
    }
    
    public Node find(int value) {
        if (this.root == null) return null;
        
        Node current = this.root;
        boolean found = false;
        
        while (current != null && !found) {
            if (value < current.value) {
                current = current.left;
            } else if (value > current.value) {
                current = current.right;
            } else {
                found = true;
            }
        }
        
        if (!found) return null;
        return current;
    }
    
    // Helper method to print the tree
    public void printTree() {
        printNode(this.root, 0);
    }
    
    private void printNode(Node node, int level) {
        if (node != null) {
            printNode(node.right, level + 1);
            System.out.println(" ".repeat(4 * level) + "->" + node.value);
            printNode(node.left, level + 1);
        }
    }
    
    public static void main(String[] args) {
        BinarySearchTree bst = new BinarySearchTree();
        
        // Insert values
        bst.insert(10);
        bst.insert(5);
        bst.insert(15);
        bst.insert(2);
        bst.insert(7);
        bst.insert(13);
        bst.insert(20);
        
        System.out.println("BST Structure:");
        bst.printTree();
        
        // Test find
        System.out.println("Find 7: " + (bst.find(7) != null ? "Found" : "Not found"));
        System.out.println("Find 25: " + (bst.find(25) != null ? "Found" : "Not found"));
        
        System.out.println("Binary Search Tree implementation test complete!");
    }
}`
      default:
        return ""
    }
  }

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang)
    setCode(getDefaultCode(lang))
    setOutput("")
  }

  const handleRunCode = () => {
    setIsRunning(true)
    setOutput("Running code...\n")

    // Simulate code execution with a delay
    setTimeout(() => {
      let result = ""

      if (language === "javascript") {
        result = `BST Structure: {
  "value": 10,
  "left": {
    "value": 5,
    "left": {
      "value": 2,
      "left": null,
      "right": null
    },
    "right": {
      "value": 7,
      "left": null,
      "right": null
    }
  },
  "right": {
    "value": 15,
    "left": {
      "value": 13,
      "left": null,
      "right": null
    },
    "right": {
      "value": 20,
      "left": null,
      "right": null
    }
  }
}
Find 7: Found
Find 25: Not found
Binary Search Tree implementation test complete!`
      } else if (language === "python") {
        result = `BST Structure:
    -> 20
-> 15
    -> 13
-> 10
    -> 7
-> 5
    -> 2
Find 7: Found
Find 25: Not found
Binary Search Tree implementation test complete!`
      } else if (language === "java") {
        result = `BST Structure:
    -> 20
-> 15
    -> 13
-> 10
    -> 7
-> 5
    -> 2
Find 7: Found
Find 25: Not found
Binary Search Tree implementation test complete!`
      }

      setOutput(`Running code...\n\n${result}`)
      setIsRunning(false)
    }, 2000)
  }

  const handleClearOutput = () => {
    setOutput("")
  }

  const handleSaveCode = () => {
    // In a real app, this would save to a database or local storage
    alert("Code saved successfully!")
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code)
    // Show a toast or notification here
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Code Editor</CardTitle>
              <CardDescription>Write and test your data structure implementations</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md overflow-hidden">
              <div className="bg-muted p-2 border-b flex justify-between items-center">
                <span className="text-sm font-medium">
                  {language === "javascript"
                    ? "script.js"
                    : language === "python"
                      ? "script.py"
                      : "BinarySearchTree.java"}
                </span>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="icon" onClick={handleCopyCode}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <textarea
                className="w-full h-[400px] p-4 font-mono text-sm bg-background resize-none focus:outline-none"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck="false"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleSaveCode}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Load
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
            <Button onClick={handleRunCode} disabled={isRunning}>
              <Play className="h-4 w-4 mr-2" />
              Run
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Output</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md overflow-hidden">
              <div className="bg-muted p-2 border-b flex justify-between items-center">
                <span className="text-sm font-medium">Console</span>
                <Button variant="ghost" size="icon" onClick={handleClearOutput}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <pre className="p-4 font-mono text-sm bg-black text-green-400 h-[300px] overflow-auto whitespace-pre-wrap">
                {output || "Run your code to see the output here..."}
              </pre>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Structure Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="array">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="array">Array</TabsTrigger>
                <TabsTrigger value="linked-list">Linked List</TabsTrigger>
                <TabsTrigger value="tree">Tree</TabsTrigger>
              </TabsList>

              <TabsContent value="array" className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start text-left"
                  onClick={() => setCode(getDefaultCode(language))}
                >
                  Binary Search
                </Button>
                <Button variant="outline" className="w-full justify-start text-left">
                  Merge Sort
                </Button>
                <Button variant="outline" className="w-full justify-start text-left">
                  Quick Sort
                </Button>
              </TabsContent>

              <TabsContent value="linked-list" className="space-y-2">
                <Button variant="outline" className="w-full justify-start text-left">
                  Singly Linked List
                </Button>
                <Button variant="outline" className="w-full justify-start text-left">
                  Doubly Linked List
                </Button>
                <Button variant="outline" className="w-full justify-start text-left">
                  Circular Linked List
                </Button>
              </TabsContent>

              <TabsContent value="tree" className="space-y-2">
                <Button variant="outline" className="w-full justify-start text-left">
                  Binary Search Tree
                </Button>
                <Button variant="outline" className="w-full justify-start text-left">
                  AVL Tree
                </Button>
                <Button variant="outline" className="w-full justify-start text-left">
                  Red-Black Tree
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

