"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Users, MessageSquare, Share2, Copy, ArrowRight } from "lucide-react"

export default function CollaborationRoom() {
  const [roomId, setRoomId] = useState("")
  const [username, setUsername] = useState("")
  const [isJoined, setIsJoined] = useState(false)
  const [activeTab, setActiveTab] = useState("join")
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<{ user: string; text: string; time: string }[]>([])
  const [participants, setParticipants] = useState<{ name: string; active: boolean }[]>([
    { name: "You", active: true },
    { name: "Guest1234", active: true },
    { name: "DataMaster", active: false },
  ])

  const handleJoinRoom = () => {
    if (!roomId || !username) return

    setIsJoined(true)
    // In a real app, this would connect to a WebSocket or similar
  }

  const handleCreateRoom = () => {
    // Generate a random room ID
    const newRoomId = Math.random().toString(36).substring(2, 10)
    setRoomId(newRoomId)

    if (!username) return

    setIsJoined(true)
    // In a real app, this would create a room on the server
  }

  const handleSendMessage = () => {
    if (!message.trim()) return

    const newMessage = {
      user: "You",
      text: message,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages([...messages, newMessage])
    setMessage("")

    // Simulate a response after a short delay
    setTimeout(() => {
      const responseMessage = {
        user: "Guest1234",
        text: "I think we should try using a binary search tree for this problem.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      setMessages((prev) => [...prev, responseMessage])
    }, 3000)
  }

  const copyRoomLink = () => {
    navigator.clipboard.writeText(`https://dataviz.example/collaborate?room=${roomId}`)
    // Show a toast or notification here
  }

  if (!isJoined) {
    return (
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Join a Collaboration Room</CardTitle>
            <CardDescription>
              Work together with others to solve problems and visualize data structures.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="join">Join Room</TabsTrigger>
                <TabsTrigger value="create">Create Room</TabsTrigger>
              </TabsList>

              <TabsContent value="join" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label htmlFor="room-id" className="text-sm font-medium">
                    Room ID
                  </label>
                  <Input
                    id="room-id"
                    placeholder="Enter room ID"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-medium">
                    Your Name
                  </label>
                  <Input
                    id="username"
                    placeholder="Enter your name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </TabsContent>

              <TabsContent value="create" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label htmlFor="create-username" className="text-sm font-medium">
                    Your Name
                  </label>
                  <Input
                    id="create-username"
                    placeholder="Enter your name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Room Settings</label>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="private-room" className="rounded border-gray-300" />
                    <label htmlFor="private-room" className="text-sm">
                      Private Room
                    </label>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={activeTab === "join" ? handleJoinRoom : handleCreateRoom}
              disabled={!username || (activeTab === "join" && !roomId)}
            >
              {activeTab === "join" ? "Join Room" : "Create Room"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3 space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Collaboration Room: {roomId}</CardTitle>
              <CardDescription>Share this room with others to collaborate in real-time</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={copyRoomLink}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md p-4 min-h-[400px] bg-muted/30">
              <div className="text-center text-muted-foreground">
                <p>Visualization workspace will appear here</p>
                <p className="text-sm mt-2">This is where the shared data structure visualization would be displayed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Chat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md p-4 h-[200px] overflow-y-auto space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground">
                  <p>No messages yet</p>
                  <p className="text-sm">Start the conversation by sending a message</p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.user === "You" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`
                        max-w-[80%] rounded-lg p-3 
                        ${msg.user === "You" ? "bg-primary text-primary-foreground" : "bg-muted"}
                      `}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{msg.user}</span>
                        <span className="text-xs opacity-70">{msg.time}</span>
                      </div>
                      <p>{msg.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex w-full items-center space-x-2">
              <Textarea
                placeholder="Type your message..."
                className="flex-1"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
              />
              <Button onClick={handleSendMessage}>
                <ArrowRight className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Participants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {participants.map((participant, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                      <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{participant.name}</span>
                  </div>
                  <Badge
                    variant={participant.active ? "default" : "outline"}
                    className={participant.active ? "bg-green-500" : ""}
                  >
                    {participant.active ? "Active" : "Away"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Room Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start">
              <MessageSquare className="h-4 w-4 mr-2" />
              Toggle Chat
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Users className="h-4 w-4 mr-2" />
              Toggle Participants
            </Button>
            <Button variant="destructive" className="w-full">
              Leave Room
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

