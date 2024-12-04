import { getServerSession } from "next-auth/next"
import { notFound, redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { CourseContent } from "@/components/courses/course-content"

interface CoursePageProps {
  params: {
    courseId: string
  }
}

export default async function CoursePage({ params }: CoursePageProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const course = await prisma.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      teacher: true,
      lessons: {
        orderBy: {
          order: "asc",
        },
      },
      assignments: {
        include: {
          submissions: {
            where: {
              studentId: session.user.role === "STUDENT" ? session.user.id : undefined,
            },
          },
        },
      },
    },
  })

  if (!course) {
    notFound()
  }

  // Check if student is enrolled
  if (session.user.role === "STUDENT") {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: session.user.id,
          courseId: course.id,
        },
      },
    })

    if (!enrollment) {
      redirect("/dashboard/courses")
    }
  }

  // Check if teacher owns the course
  if (session.user.role === "TEACHER" && course.teacherId !== session.user.id) {
    redirect("/dashboard/courses")
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{course.title}</h2>
          <p className="text-gray-500">
            Grade {course.grade} • {course.subject}
          </p>
        </div>
      </div>
      <CourseContent
        course={course}
        userRole={session.user.role}
        userId={session.user.id}
      />
    </div>
  )
}
