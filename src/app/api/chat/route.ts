import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { WebSocket } from "ws"

const wss = new WebSocket.Server({ port: 3001 })

const clients = new Set<WebSocket>()

wss.on("connection", (ws) => {
  clients.add(ws)

  ws.on("close", () => {
    clients.delete(ws)
  })
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const { content, courseId, senderId, senderName } = await req.json()

    // Save message to database
    const message = await prisma.chatMessage.create({
      data: {
        content,
        courseId,
        senderId,
        senderName,
      },
    })

    // Broadcast message to all connected clients
    const broadcastMessage = JSON.stringify(message)
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(broadcastMessage)
      }
    })

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    console.error("Chat error:", error)
    return NextResponse.json(
      { message: "Error sending message" },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const courseId = searchParams.get("courseId")

    if (!courseId) {
      return NextResponse.json(
        { message: "Course ID is required" },
        { status: 400 }
      )
    }

    const messages = await prisma.chatMessage.findMany({
      where: {
        courseId,
      },
      orderBy: {
        createdAt: "asc",
      },
    })

    return NextResponse.json(messages)
  } catch (error) {
    console.error("Chat fetch error:", error)
    return NextResponse.json(
      { message: "Error fetching messages" },
      { status: 500 }
    )
  }
}
