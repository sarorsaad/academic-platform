"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface StudyGroup {
  id: string
  name: string
  description: string
  courseId: string
  memberCount: number
  isJoined: boolean
}

interface StudyGroupProps {
  courseId: string
}

export function StudyGroup({ courseId }: StudyGroupProps) {
  const { data: session } = useSession()
  const [groups, setGroups] = useState<StudyGroup[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newGroupName, setNewGroupName] = useState("")
  const [newGroupDescription, setNewGroupDescription] = useState("")
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null)
  const [messages, setMessages] = useState<Array<{
    sender: string
    content: string
    timestamp: Date
  }>>([])
  const [newMessage, setNewMessage] = useState("")

  useEffect(() => {
    fetchGroups()
  }, [courseId])

  const fetchGroups = async () => {
    try {
      const response = await fetch(`/api/study-groups?courseId=${courseId}`)
      const data = await response.json()
      setGroups(data)
    } catch (error) {
      console.error("Failed to fetch study groups:", error)
    }
  }

  const createGroup = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/study-groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newGroupName,
          description: newGroupDescription,
          courseId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create study group")
      }

      setNewGroupName("")
      setNewGroupDescription("")
      setShowCreateForm(false)
      fetchGroups()
    } catch (error) {
      console.error("Failed to create study group:", error)
    }
  }

  const joinGroup = async (groupId: string) => {
    try {
      await fetch(`/api/study-groups/${groupId}/join`, {
        method: "POST",
      })
      fetchGroups()
    } catch (error) {
      console.error("Failed to join study group:", error)
    }
  }

  const leaveGroup = async (groupId: string) => {
    try {
      await fetch(`/api/study-groups/${groupId}/leave`, {
        method: "POST",
      })
      fetchGroups()
      if (selectedGroup?.id === groupId) {
        setSelectedGroup(null)
      }
    } catch (error) {
      console.error("Failed to leave study group:", error)
    }
  }

  const selectGroup = async (group: StudyGroup) => {
    setSelectedGroup(group)
    try {
      const response = await fetch(`/api/study-groups/${group.id}/messages`)
      const data = await response.json()
      setMessages(data)
    } catch (error) {
      console.error("Failed to fetch messages:", error)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedGroup || !newMessage.trim()) return

    try {
      const response = await fetch(
        `/api/study-groups/${selectedGroup.id}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: newMessage,
          }),
        }
      )

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      setNewMessage("")
      const data = await response.json()
      setMessages((prev) => [...prev, data])
    } catch (error) {
      console.error("Failed to send message:", error)
    }
  }

  return (
    <div className="grid gap-4 lg:grid-cols-12">
      {/* Study Groups List */}
      <Card className="lg:col-span-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Study Groups</CardTitle>
            <Button onClick={() => setShowCreateForm(true)}>Create Group</Button>
          </div>
        </CardHeader>
        <CardContent>
          {showCreateForm && (
            <form onSubmit={createGroup} className="mb-4 space-y-4">
              <Input
                placeholder="Group Name"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                required
              />
              <Input
                placeholder="Description"
                value={newGroupDescription}
                onChange={(e) => setNewGroupDescription(e.target.value)}
                required
              />
              <div className="flex space-x-2">
                <Button type="submit">Create</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}

          <div className="space-y-2">
            {groups.map((group) => (
              <Card
                key={group.id}
                className={`cursor-pointer p-4 hover:bg-gray-50 ${
                  selectedGroup?.id === group.id ? "border-blue-500" : ""
                }`}
                onClick={() => selectGroup(group)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{group.name}</h3>
                    <p className="text-sm text-gray-500">
                      {group.memberCount} members
                    </p>
                  </div>
                  {group.isJoined ? (
                    <Button
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        leaveGroup(group.id)
                      }}
                    >
                      Leave
                    </Button>
                  ) : (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        joinGroup(group.id)
                      }}
                    >
                      Join
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Group Chat */}
      <Card className="lg:col-span-8">
        <CardHeader>
          <CardTitle>
            {selectedGroup ? selectedGroup.name : "Select a group"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedGroup ? (
            <div className="flex h-[500px] flex-col">
              <div className="flex-1 space-y-4 overflow-y-auto">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.sender === session?.user?.name
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-2 ${
                        message.sender === session?.user?.name
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100"
                      }`}
                    >
                      <p className="text-sm font-medium">{message.sender}</p>
                      <p>{message.content}</p>
                      <p className="text-xs opacity-70">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={sendMessage} className="mt-4">
                <div className="flex space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                  />
                  <Button type="submit">Send</Button>
                </div>
              </form>
            </div>
          ) : (
            <div className="flex h-[500px] items-center justify-center text-gray-500">
              Select a study group to start chatting
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
