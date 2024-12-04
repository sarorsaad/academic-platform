"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface FileUploadProps {
  courseId: string
  onUploadComplete?: () => void
}

export function FileUpload({ courseId, onUploadComplete }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const router = useRouter()

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setProgress(0)

    try {
      // Get presigned URL
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          courseId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get upload URL")
      }

      const { url, fields } = await response.json()

      // Create form data
      const formData = new FormData()
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value as string)
      })
      formData.append("file", file)

      // Upload to S3
      const uploadResponse = await fetch(url, {
        method: "POST",
        body: formData,
      })

      if (!uploadResponse.ok) {
        throw new Error("Upload failed")
      }

      // Save file reference
      await fetch("/api/files", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          courseId,
          size: file.size,
          url: `${url}/${fields.key}`,
        }),
      })

      onUploadComplete?.()
      router.refresh()
    } catch (error) {
      console.error("Upload error:", error)
      alert("Failed to upload file")
    } finally {
      setIsUploading(false)
      setProgress(0)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Course Materials</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            type="file"
            onChange={handleFileChange}
            disabled={isUploading}
            accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.mp4,.mp3"
          />
          {isUploading && (
            <div className="h-2 w-full rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-blue-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
          <p className="text-sm text-gray-500">
            Supported formats: PDF, Word, PowerPoint, Text, Video, Audio
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
