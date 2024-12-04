import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { CourseGrid } from "@/components/courses/course-grid"
import { Button } from "@/components/ui/button"

export default async function CoursesPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  let courses = []

  if (session.user.role === "STUDENT") {
    // Get enrolled courses for student
    const enrollments = await prisma.enrollment.findMany({
      where: {
        studentId: session.user.id,
      },
      include: {
        course: {
          include: {
            teacher: true,
          },
        },
      },
    })
    courses = enrollments.map((enrollment) => enrollment.course)
  } else if (session.user.role === "TEACHER") {
    // Get courses created by teacher
    courses = await prisma.course.findMany({
      where: {
        teacherId: session.user.id,
      },
      include: {
        teacher: true,
      },
    })
  } else {
    // Admin can see all courses
    courses = await prisma.course.findMany({
      include: {
        teacher: true,
      },
    })
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Courses</h2>
        {session.user.role !== "STUDENT" && (
          <Button href="/dashboard/courses/new" className="ml-auto">
            Create Course
          </Button>
        )}
      </div>
      <CourseGrid courses={courses} userRole={session.user.role} />
    </div>
  )
}
