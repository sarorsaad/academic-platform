import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const { courseId, lessonId, score, answers } = await req.json()

    // Save assessment result
    const assessment = await prisma.assessment.create({
      data: {
        courseId,
        lessonId,
        studentId: session.user.id,
        score,
        answers: JSON.stringify(answers),
      },
    })

    // Update student progress
    await prisma.studentProgress.upsert({
      where: {
        studentId_courseId_lessonId: {
          studentId: session.user.id,
          courseId,
          lessonId,
        },
      },
      update: {
        completed: true,
        score,
      },
      create: {
        studentId: session.user.id,
        courseId,
        lessonId,
        completed: true,
        score,
      },
    })

    return NextResponse.json(assessment, { status: 201 })
  } catch (error) {
    console.error("Assessment error:", error)
    return NextResponse.json(
      { message: "Error saving assessment" },
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
    const lessonId = searchParams.get("lessonId")

    const assessments = await prisma.assessment.findMany({
      where: {
        courseId,
        lessonId,
        studentId: session.user.role === "STUDENT" ? session.user.id : undefined,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(assessments)
  } catch (error) {
    console.error("Assessment fetch error:", error)
    return NextResponse.json(
      { message: "Error fetching assessments" },
      { status: 500 }
    )
  }
}
