import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== "TEACHER" && session.user.role !== "ADMIN")) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const { title, description, grade, subject, teacherId } = await req.json()

    // Basic validation
    if (!title || !description || !grade || !subject || !teacherId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      )
    }

    // Create course
    const course = await prisma.course.create({
      data: {
        title,
        description,
        grade,
        subject,
        teacherId,
      },
    })

    return NextResponse.json(course, { status: 201 })
  } catch (error) {
    console.error("Course creation error:", error)
    return NextResponse.json(
      { message: "Error creating course" },
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
    const grade = searchParams.get("grade")
    const subject = searchParams.get("subject")

    const where: any = {}

    if (grade) {
      where.grade = parseInt(grade)
    }

    if (subject) {
      where.subject = subject
    }

    if (session.user.role === "TEACHER") {
      where.teacherId = session.user.id
    }

    const courses = await prisma.course.findMany({
      where,
      include: {
        teacher: true,
      },
    })

    return NextResponse.json(courses)
  } catch (error) {
    console.error("Course fetch error:", error)
    return NextResponse.json(
      { message: "Error fetching courses" },
      { status: 500 }
    )
  }
}
