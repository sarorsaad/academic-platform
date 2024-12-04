"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Course {
  id: string
  title: string
  description: string
  imageUrl: string | null
  grade: number
  subject: string
  teacher: {
    name: string
  }
}

interface CourseGridProps {
  courses: Course[]
  userRole: string
}

export function CourseGrid({ courses, userRole }: CourseGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <Card key={course.id} className="overflow-hidden">
          <div className="relative h-48">
            <Image
              src={course.imageUrl || "/course-placeholder.jpg"}
              alt={course.title}
              fill
              className="object-cover"
            />
          </div>
          <CardHeader>
            <CardTitle>{course.title}</CardTitle>
            <div className="flex items-center text-sm text-gray-500">
              <span>Grade {course.grade}</span>
              <span className="mx-2">•</span>
              <span>{course.subject}</span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">{course.description}</p>
            <p className="mt-2 text-sm text-gray-500">Teacher: {course.teacher.name}</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button asChild>
              <Link href={`/dashboard/courses/${course.id}`}>
                {userRole === "STUDENT" ? "View Course" : "Manage Course"}
              </Link>
            </Button>
            {userRole === "STUDENT" && (
              <Button variant="outline" asChild>
                <Link href={`/dashboard/courses/${course.id}/progress`}>View Progress</Link>
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
