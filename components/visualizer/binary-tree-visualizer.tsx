"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Plus, Minus, Search, RotateCcw } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TreeNode {
  value: number
  id: string
  left: TreeNode | null
  right: TreeNode | null
  x?: number
  y?: number
  highlighted?: boolean
  visiting?: boolean
}

export default function BinaryTreeVisualizer() {
  const [root, setRoot] = useState<TreeNode | null>(null);
  const [value, setValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [traversalOrder, setTraversalOrder] = useState('inorder');
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(50);
  const [message, setMessage] = useState('');
  const [flattenedTree, setFlattenedTree] = useState<TreeNode[]>([]);
  const [treeHeight, setTreeHeight] = useState(0);
  const [visitedNodes, setVisitedNodes] = useState<string[]>([]);
  
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    generateRandomTree();
  }, []);

  useEffect(() => {
    if (root) {
      const { nodes, height } = flattenTree(root);
      setFlattenedTree(nodes);
      setTreeHeight(height);
    } else {
      setFlattenedTree([]);
      setTreeHeight(0);
    }
  }, [root]);

  const generateRandomTree = () => {
    // Create a balanced BST with 7-15 random nodes
    const size = Math.floor(Math.random() * 9) + 7;
    const values = Array.from({ length: size }, () => 
      Math.floor(Math.random() * 100)
    ).sort((a, b) => a - b);
    
    const newRoot = buildBalancedBST(values, 0, values.length - 1);
    setRoot(newRoot);
    setVisitedNodes([]);
    setMessage('');
  };

  const buildBalancedBST = (
    sortedValues: number[], 
    start: number, 
    end: number
  ): TreeNode | null => {
    if (start > end) return null;
    
    const mid = Math.floor((start + end) / 2);
    const node: TreeNode = {
      value: sortedValues[mid],
      id: Math.random().toString(36).substring(2, 9),
      left: null,
      right: null
    };
    
    node.left = buildBalancedBST(sortedValues, start, mid - 1);
    node.right = buildBalancedBST(sortedValues, mid + 1, end);
    
    return node;
  };

  const flattenTree = (node: TreeNode | null, level = 0, position = 0): { nodes: TreeNode[], height: number } => {
    if (!node) return { nodes: [], height: 0 };
    
    const leftResult = flattenTree(node.left, level + 1, position * 2);
    const rightResult = flattenTree(node.right, level + 1, position * 2 + 1);
    
    const height = Math.max(leftResult.height, rightResult.height) + 1;
    
    // Calculate x and y positions for visualization
    // Increase the horizontal spacing factor from maxWidth to maxWidth * 1.5
    const maxWidth = Math.pow(2, height) - 1;
    node.x = (position + 1) * (maxWidth * 1.5 / (Math.pow(2, level) + 1));
    node.y = level + 1;
    
    return {
      nodes: [...leftResult.nodes, node, ...rightResult.nodes],
      height
    };
  };

  const handleInsert = () => {
    if (value === '') return;
    
    const numValue = Number.parseInt(value);
    if (isNaN(numValue)) return;
    
    setIsAnimating(true);
    setMessage(`Inserting ${numValue}...`);
    
    const newRoot = insertNode(root, numValue);
    setRoot(newRoot);
    
    setTimeout(() => {
      setIsAnimating(false);
      setMessage(`Inserted ${numValue} into the tree`);
    }, 1000);
    
    setValue('');
  };

  const insertNode = (node: TreeNode | null, value: number): TreeNode => {
    if (node === null) {
      return {
        value,
        id: Math.random().toString(36).substring(2, 9),
        left: null,
        right: null,
        highlighted: true
      };
    }
    
    if (value < node.value) {
      node.left = insertNode(node.left, value);
    } else if (value > node.value) {
      node.right = insertNode(node.right, value);
    } else {
      // Value already exists, update the node
      node.highlighted = true;
    }
    
    return { ...node };
  };

  const handleRemove = () => {
    if (value === '') return;
    
    const numValue = Number.parseInt(value);
    if (isNaN(numValue)) return;
    
    setIsAnimating(true);
    setMessage(`Removing ${numValue}...`);
    
    const newRoot = removeNode(root, numValue);
    setRoot(newRoot);
    
    setTimeout(() => {
      setIsAnimating(false);
      setMessage(newRoot !== root ? `Removed ${numValue} from the tree` : `Value ${numValue} not found in the tree`);
    }, 1000);
    
    setValue('');
  };

  const removeNode = (node: TreeNode | null, value: number): TreeNode | null => {
    if (node === null) return null;
    
    if (value < node.value) {
      node.left = removeNode(node.left, value);
      return { ...node };
    } else if (value > node.value) {
      node.right = removeNode(node.right, value);
      return { ...node };
    } else {
      // Node to be deleted found
      
      // Case 1: Leaf node
      if (node.left === null && node.right === null) {
        return null;
      }
      
      // Case 2: Node with only one child
      if (node.left === null) {
        return node.right;
      } else if (node.right === null) {
        return node.left;
      }
      
      // Case 3: Node with two children
      // Find the inorder successor (smallest node in right subtree)
      let successor = node.right;
      while (successor.left !== null) {
        successor = successor.left;
      }
      
      // Replace the node's value with successor's value
      const newNode = { ...node, value: successor.value };
      
      // Remove the successor
      newNode.right = removeNode(node.right, successor.value);
      
      return newNode;
    }
  };

  const handleSearch = () => {
    if (searchValue === '') return;
    
    const numValue = Number.parseInt(searchValue);
    if (isNaN(numValue)) return;
    
    setIsAnimating(true);
    setMessage(`Searching for ${numValue}...`);
    setVisitedNodes([]);
    
    const found = searchNode(root, numValue, (nodeId) => {
      setVisitedNodes(prev => [...prev, nodeId]);
    });
    
    setTimeout(() => {
      setIsAnimating(false);
      setMessage(found ? `Found ${numValue} in the tree` : `Value ${numValue} not found in the tree`);
    }, 1000 * (visitedNodes.length + 1));
    
    setSearchValue('');
  };

  const searchNode = (
    node: TreeNode | null, 
    value: number,
    onVisit: (nodeId: string) => void
  ): boolean => {
    if (node === null) return false;
    
    setTimeout(() => {
      onVisit(node.id);
    }, 1000 * visitedNodes.length);
    
    if (node.value === value) {
      return true;
    }
    
    if (value < node.value) {
      return searchNode(node.left, value, onVisit);
    } else {
      return searchNode(node.right, value, onVisit);
    }
  };

  const handleTraverse = () => {
    if (!root) return;
    
    setIsAnimating(true);
    setMessage(`Traversing in ${traversalOrder} order...`);
    setVisitedNodes([]);
    
    const traversalResult: number[] = [];
    
    if (traversalOrder === 'inorder') {
      inorderTraversal(root, traversalResult);
    } else if (traversalOrder === 'preorder') {
      preorderTraversal(root, traversalResult);
    } else if (traversalOrder === 'postorder') {
      postorderTraversal(root, traversalResult);
    } else if (traversalOrder === 'levelorder') {
      levelOrderTraversal(root, traversalResult);
    }
    
    animateTraversal(traversalResult);
  };

  const inorderTraversal = (node: TreeNode | null, result: number[]) => {
    if (node === null) return;
    inorderTraversal(node.left, result);
    result.push(Number.parseInt(node.id, 36));
    inorderTraversal(node.right, result);
  };

  const preorderTraversal = (node: TreeNode | null, result: number[]) => {
    if (node === null) return;
    result.push(Number.parseInt(node.id, 36));
    preorderTraversal(node.left, result);
    preorderTraversal(node.right, result);
  };

  const postorderTraversal = (node: TreeNode | null, result: number[]) => {
    if (node === null) return;
    postorderTraversal(node.left, result);
    postorderTraversal(node.right, result);
    result.push(Number.parseInt(node.id, 36));
  };

  const levelOrderTraversal = (node: TreeNode | null, result: number[]) => {
    if (node === null) return;
    
    const queue: TreeNode[] = [node];
    
    while (queue.length > 0) {
      const current = queue.shift()!;
      result.push(Number.parseInt(current.id, 36));
      
      if (current.left) queue.push(current.left);
      if (current.right) queue.push(current.right);
    }
  };

  const animateTraversal = (nodeIds: number[]) => {
    let i = 0;
    
    const animate = () => {
      if (i >= nodeIds.length) {
        setIsAnimating(false);
        setMessage(`${traversalOrder} traversal complete`);
        return;
      }
      
      const nodeId = nodeIds[i].toString(36);
      setVisitedNodes(prev => [...prev, nodeId]);
      
      i++;
      setTimeout(animate, 1000 - animationSpeed * 9);
    };
    
    animate();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Binary Search Tree Visualization</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={generateRandomTree}
                disabled={isAnimating}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
            
            <div 
              ref={canvasRef}
              className="relative w-full min-h-[300px] border rounded-md p-4 overflow-auto"
              style={{ minWidth: '100%', overflowX: 'auto' }}
            >
              {flattenedTree.length > 0 ? (
                <div className="relative w-full h-full">
                  {flattenedTree.map((node) => {
                    const parentNode = flattenedTree.find(n => 
                      (n.left && n.left.id === node.id) || (n.right && n.right.id === node.id)
                    );
                    
                    return (
                      <div key={node.id}>
                        {/* Node */}
                        <div
                          className={`
                            absolute flex items-center justify-center
                            w-14 h-14 rounded-full border-2 border-primary
                            transition-all duration-300
                            ${visitedNodes.includes(node.id) ? 'bg-blue-100 dark:bg-blue-900 border-blue-500' : ''}
                            ${node.highlighted ? 'bg-green-100 dark:bg-green-900 border-green-500 scale-110' : ''}
                          `}
                          style={{
                            left: `${(node.x || 0) * 50}px`,  // Increase from 40 to 50
                            top: `${(node.y || 0) * 70}px`,   // Increase from 60 to 70
                            transform: 'translate(-50%, -50%)'
                          }}
                        >
                          {node.value}
                        </div>
                        
                        {/* Edges to children */}
                        {node.left && (
                          <div
                            className="absolute border-t-2 border-muted-foreground"
                            style={{
                              left: `${(node.x || 0) * 50}px`,  // Update to match node positioning
                              top: `${(node.y || 0) * 70}px`,   // Update to match node positioning
                              width: `${Math.abs(((node.left.x || 0) - (node.x || 0)) * 50)}px`,  // Update to match
                              height: '1px',
                              transform: 'rotate(45deg)',
                              transformOrigin: 'left top'
                            }}
                          />
                        )}
                        
                        {node.right && (
                          <div
                            className="absolute border-t-2 border-muted-foreground"
                            style={{
                              left: `${(node.x || 0) * 50}px`,  // Update to match node positioning
                              top: `${(node.y || 0) * 70}px`,   // Update to match node positioning
                              width: `${Math.abs(((node.right.x || 0) - (node.x || 0)) * 50)}px`,  // Update to match
                              height: '1px',
                              transform: 'rotate(-45deg)',
                              transformOrigin: 'left top'
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">Tree is empty</p>
                </div>
              )}
            </div>
            
            {message && (
              <div className="mt-4 p-2 rounded bg-muted text-center">
                {message}
              </div>
            )}
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
            
            <div className="flex space-x-2">
              <Button 
                onClick={handleInsert} 
                disabled={isAnimating || value === ''}
                className="flex-1"
              >
                <Plus className="h-4 w-4 mr-2" />
                Insert
              </Button>
              <Button 
                onClick={handleRemove} 
                disabled={isAnimating || value === '' || !root}
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
                  disabled={isAnimating || searchValue === '' || !root}
                  variant="outline"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Traversal Order</Label>
              <Select
                value={traversalOrder}
                onValueChange={setTraversalOrder}
                disabled={isAnimating}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select traversal order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inorder">Inorder</SelectItem>
                  <SelectItem value="preorder">Preorder</SelectItem>
                  <SelectItem value="postorder">Postorder</SelectItem>
                  <SelectItem value="levelorder">Level Order</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={handleTraverse} 
              disabled={isAnimating || !root}
              className="w-full"
            >
              Traverse
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
          <h3 className="text-lg font-medium mb-4">Binary Search Tree Operations</h3>
          <div className="space-y-2">\
            <p><strong>Insert:</strong> Add a node while maintaining the BST property left subtree values  node value right subtree values.</p>
            <p><strong>Remove:</strong> Delete a node and restructure the tree to maintain the BST property.</p>
            <p><strong>Search:</strong> Find a node with a specific value in the tree.</p>
            <p><strong>Traversal:</strong> Visit all nodes in a specific order (inorder, preorder, postorder, or level order).</p>
            <p><strong>Time Complexity:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Search, Insert, Delete: O(log n) for balanced trees, O(n) for unbalanced trees</li>
              <li>Traversal: O(n) - Must visit every node in the tree</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

