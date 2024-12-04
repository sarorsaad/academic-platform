"use client"

import { useState, useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface LiveClassroomProps {
  courseId: string
  sessionId: string
  isTeacher: boolean
}

export function LiveClassroom({ courseId, sessionId, isTeacher }: LiveClassroomProps) {
  const { data: session } = useSession()
  const [isConnected, setIsConnected] = useState(false)
  const [participants, setParticipants] = useState<string[]>([])
  const [isMuted, setIsMuted] = useState(true)
  const [isVideoOff, setIsVideoOff] = useState(true)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([])
  const [newMessage, setNewMessage] = useState("")
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const screenShareRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Initialize Twilio Video
    const initVideo = async () => {
      try {
        const response = await fetch("/api/video/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            courseId,
            sessionId,
            userId: session?.user?.id,
          }),
        })

        const { token } = await response.json()

        // Connect to Twilio room
        const Video = (await import("twilio-video")).default
        const room = await Video.connect(token, {
          name: sessionId,
          audio: true,
          video: true,
        })

        setIsConnected(true)

        // Handle participant connected
        room.on("participantConnected", (participant) => {
          setParticipants((prev) => [...prev, participant.identity])
        })

        // Handle participant disconnected
        room.on("participantDisconnected", (participant) => {
          setParticipants((prev) => 
            prev.filter((p) => p !== participant.identity)
          )
        })

        return () => {
          room.disconnect()
        }
      } catch (error) {
        console.error("Failed to connect to video room:", error)
      }
    }

    if (session?.user) {
      initVideo()
    }
  }, [courseId, sessionId, session])

  const toggleAudio = () => {
    setIsMuted(!isMuted)
    // Implementation with Twilio Video
  }

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff)
    // Implementation with Twilio Video
  }

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        })
        if (screenShareRef.current) {
          screenShareRef.current.srcObject = stream
        }
      } else {
        const stream = screenShareRef.current?.srcObject as MediaStream
        stream?.getTracks().forEach((track) => track.stop())
        if (screenShareRef.current) {
          screenShareRef.current.srcObject = null
        }
      }
      setIsScreenSharing(!isScreenSharing)
    } catch (error) {
      console.error("Screen sharing error:", error)
    }
  }

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    setMessages((prev) => [
      ...prev,
      { sender: session?.user?.name || "Anonymous", text: newMessage },
    ])
    setNewMessage("")
  }

  return (
    <div className="grid h-[calc(100vh-4rem)] grid-cols-12 gap-4 p-4">
      {/* Main Video Area */}
      <div className="col-span-9 space-y-4">
        <Card className="h-full">
          <CardContent className="p-0">
            <div className="relative h-full">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="h-full w-full object-cover"
              />
              {isScreenSharing && (
                <video
                  ref={screenShareRef}
                  autoPlay
                  playsInline
                  className="absolute inset-0 h-full w-full object-contain"
                />
              )}
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-4">
                <Button
                  variant={isMuted ? "destructive" : "default"}
                  onClick={toggleAudio}
                >
                  {isMuted ? "Unmute" : "Mute"}
                </Button>
                <Button
                  variant={isVideoOff ? "destructive" : "default"}
                  onClick={toggleVideo}
                >
                  {isVideoOff ? "Start Video" : "Stop Video"}
                </Button>
                {isTeacher && (
                  <Button
                    variant={isScreenSharing ? "destructive" : "default"}
                    onClick={toggleScreenShare}
                  >
                    {isScreenSharing ? "Stop Sharing" : "Share Screen"}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="col-span-3 space-y-4">
        {/* Participants */}
        <Card>
          <CardHeader>
            <CardTitle>Participants ({participants.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {participants.map((participant) => (
                <div
                  key={participant}
                  className="flex items-center justify-between"
                >
                  <span>{participant}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat */}
        <Card className="flex h-[calc(100vh-20rem)] flex-col">
          <CardHeader>
            <CardTitle>Chat</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col">
            <div className="flex-1 space-y-4 overflow-y-auto">
              {messages.map((message, index) => (
                <div key={index} className="space-y-1">
                  <p className="text-sm font-medium">{message.sender}</p>
                  <p className="rounded-lg bg-gray-100 p-2 text-sm">
                    {message.text}
                  </p>
                </div>
              ))}
            </div>
            <form onSubmit={sendMessage} className="mt-4">
              <div className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                />
                <Button type="submit">Send</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
