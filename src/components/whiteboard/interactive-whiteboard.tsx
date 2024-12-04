"use client"

import { useEffect, useRef, useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ChromePicker } from "react-color"

interface WhiteboardProps {
  sessionId: string
  isTeacher: boolean
}

interface DrawingData {
  type: "draw" | "erase"
  x: number
  y: number
  color: string
  width: number
}

export function InteractiveWhiteboard({ sessionId, isTeacher }: WhiteboardProps) {
  const { data: session } = useSession()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [tool, setTool] = useState<"pen" | "eraser">("pen")
  const [color, setColor] = useState("#000000")
  const [width, setWidth] = useState(2)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [socket, setSocket] = useState<WebSocket | null>(null)

  useEffect(() => {
    const ws = new WebSocket(
      `${process.env.NEXT_PUBLIC_WS_URL}/whiteboard/${sessionId}`
    )

    ws.onmessage = (event) => {
      const data: DrawingData = JSON.parse(event.data)
      draw(data)
    }

    setSocket(ws)

    return () => {
      ws.close()
    }
  }, [sessionId])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Set initial canvas background
    context.fillStyle = "#ffffff"
    context.fillRect(0, 0, canvas.width, canvas.height)
  }, [])

  const draw = (data: DrawingData) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    context.beginPath()
    context.moveTo(data.x, data.y)

    if (data.type === "draw") {
      context.strokeStyle = data.color
      context.lineWidth = data.width
    } else {
      context.strokeStyle = "#ffffff"
      context.lineWidth = 20
    }

    context.lineTo(data.x, data.y)
    context.stroke()
    context.closePath()
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const data: DrawingData = {
      type: tool === "pen" ? "draw" : "erase",
      x,
      y,
      color,
      width,
    }

    draw(data)
    socket?.send(JSON.stringify(data))
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const handleDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const data: DrawingData = {
      type: tool === "pen" ? "draw" : "erase",
      x,
      y,
      color,
      width,
    }

    draw(data)
    socket?.send(JSON.stringify(data))
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d")
    if (!context) return

    context.fillStyle = "#ffffff"
    context.fillRect(0, 0, canvas.width, canvas.height)

    socket?.send(
      JSON.stringify({
        type: "clear",
      })
    )
  }

  const saveCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dataUrl = canvas.toDataURL("image/png")
    const link = document.createElement("a")
    link.download = `whiteboard-${sessionId}.png`
    link.href = dataUrl
    link.click()
  }

  return (
    <Card className="flex h-[600px] flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Interactive Whiteboard</CardTitle>
          <div className="flex space-x-2">
            <Button
              variant={tool === "pen" ? "default" : "outline"}
              onClick={() => setTool("pen")}
            >
              Pen
            </Button>
            <Button
              variant={tool === "eraser" ? "default" : "outline"}
              onClick={() => setTool("eraser")}
            >
              Eraser
            </Button>
            {tool === "pen" && (
              <div className="relative">
                <Button
                  variant="outline"
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  style={{ backgroundColor: color }}
                >
                  Color
                </Button>
                {showColorPicker && (
                  <div className="absolute right-0 z-10">
                    <ChromePicker
                      color={color}
                      onChange={(color) => setColor(color.hex)}
                    />
                  </div>
                )}
              </div>
            )}
            <div className="w-32">
              <Slider
                value={[width]}
                onValueChange={(value) => setWidth(value[0])}
                min={1}
                max={10}
                step={1}
              />
            </div>
            {isTeacher && (
              <>
                <Button variant="outline" onClick={clearCanvas}>
                  Clear
                </Button>
                <Button variant="outline" onClick={saveCanvas}>
                  Save
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <canvas
          ref={canvasRef}
          className="h-full w-full cursor-crosshair border"
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onMouseMove={handleDrawing}
        />
      </CardContent>
    </Card>
  )
}
