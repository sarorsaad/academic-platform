import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { CreateCourseForm } from "@/components/courses/create-course-form"

export default async function NewCoursePage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role === "STUDENT") {
    redirect("/dashboard/courses")
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Create New Course</h2>
      <div className="grid gap-6">
        <CreateCourseForm userId={session.user.id} />
      </div>
    </div>
  )
}
