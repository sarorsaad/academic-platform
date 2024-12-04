"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface LearningAssistantProps {
  courseId: string
  lessonId: string
}

export function LearningAssistant({ courseId, lessonId }: LearningAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")
    setIsLoading(true)

    // Add user message to chat
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          courseId,
          lessonId,
          history: messages,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get AI response")
      }

      const data = await response.json()

      // Add AI response to chat
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ])
    } catch (error) {
      console.error("AI chat error:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I apologize, but I'm having trouble responding right now. Please try again.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const generateStudyNotes = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/ai/study-notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId,
          lessonId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate study notes")
      }

      const data = await response.json()
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Here are your personalized study notes:\n\n" + data.notes,
        },
      ])
    } catch (error) {
      console.error("Study notes generation error:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I apologize, but I couldn't generate study notes at the moment. Please try again.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const generatePracticeQuestions = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/ai/practice-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId,
          lessonId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate practice questions")
      }

      const data = await response.json()
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Here are some practice questions to help you learn:\n\n" +
            data.questions,
        },
      ])
    } catch (error) {
      console.error("Practice questions generation error:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I apologize, but I couldn't generate practice questions at the moment. Please try again.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="flex h-[600px] flex-col">
      <CardHeader>
        <CardTitle>AI Learning Assistant</CardTitle>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={generateStudyNotes}
            disabled={isLoading}
          >
            Generate Study Notes
          </Button>
          <Button
            variant="outline"
            onClick={generatePracticeQuestions}
            disabled={isLoading}
          >
            Practice Questions
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <div className="flex-1 space-y-4 overflow-y-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "assistant" ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === "assistant"
                    ? "bg-gray-100"
                    : "bg-blue-500 text-white"
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={sendMessage} className="mt-4">
          <div className="flex space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about the lesson..."
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "..." : "Send"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
