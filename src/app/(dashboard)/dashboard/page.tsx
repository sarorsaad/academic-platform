import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { StudentDashboard } from "@/components/dashboard/student-dashboard"
import { TeacherDashboard } from "@/components/dashboard/teacher-dashboard"
import { AdminDashboard } from "@/components/dashboard/admin-dashboard"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      {session.user.role === "ADMIN" ? (
        <AdminDashboard />
      ) : session.user.role === "TEACHER" ? (
        <TeacherDashboard />
      ) : (
        <StudentDashboard />
      )}
    </div>
  )
}
