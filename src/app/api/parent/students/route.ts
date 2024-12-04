import { NextResponse } from "next/server"
import { mockStudents } from "@/lib/mock-data"

export async function GET(req: Request) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const { searchParams } = new URL(req.url)
  const parentId = searchParams.get("parentId")

  if (!parentId) {
    return NextResponse.json(
      { error: "Parent ID is required" },
      { status: 400 }
    )
  }

  // Return mock data
  return NextResponse.json(mockStudents)
}
