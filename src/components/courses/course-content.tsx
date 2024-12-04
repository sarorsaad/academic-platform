"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Lesson {
  id: string
  title: string
  content: string
  videoUrl: string | null
  order: number
}

interface Assignment {
  id: string
  title: string
  description: string
  dueDate: Date
  submissions: Array<{
    id: string
    grade: number | null
  }>
}

interface Course {
  id: string
  title: string
  description: string
  grade: number
  subject: string
  lessons: Lesson[]
  assignments: Assignment[]
  teacher: {
    name: string
  }
}

interface CourseContentProps {
  course: Course
  userRole: string
  userId: string
}

export function CourseContent({ course, userRole, userId }: CourseContentProps) {
  const [activeTab, setActiveTab] = useState("lessons")
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(
    course.lessons[0] || null
  )

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* Sidebar */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <div className="flex space-x-4">
            <Button
              variant={activeTab === "lessons" ? "default" : "outline"}
              onClick={() => setActiveTab("lessons")}
            >
              Lessons
            </Button>
            <Button
              variant={activeTab === "assignments" ? "default" : "outline"}
              onClick={() => setActiveTab("assignments")}
            >
              Assignments
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {activeTab === "lessons" ? (
            <div className="space-y-2">
              {course.lessons.map((lesson) => (
                <button
                  key={lesson.id}
                  onClick={() => setSelectedLesson(lesson)}
                  className={`w-full rounded-lg p-2 text-left hover:bg-gray-100 ${
                    selectedLesson?.id === lesson.id ? "bg-gray-100" : ""
                  }`}
                >
                  {lesson.title}
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {course.assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="rounded-lg border p-4 hover:bg-gray-50"
                >
                  <h3 className="font-medium">{assignment.title}</h3>
                  <p className="text-sm text-gray-500">
                    Due: {new Date(assignment.dueDate).toLocaleDateString()}
                  </p>
                  {userRole === "STUDENT" && (
                    <div className="mt-2">
                      {assignment.submissions.length > 0 ? (
                        <p className="text-sm text-green-600">
                          Submitted
                          {assignment.submissions[0].grade && (
                            <span>
                              {" "}
                              • Grade: {assignment.submissions[0].grade}%
                            </span>
                          )}
                        </p>
                      ) : (
                        <Button size="sm">Submit Assignment</Button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="space-y-6 lg:col-span-9">
        {activeTab === "lessons" && selectedLesson ? (
          <Card>
            <CardHeader>
              <CardTitle>{selectedLesson.title}</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedLesson.videoUrl && (
                <div className="mb-6 aspect-video">
                  <iframe
                    src={selectedLesson.videoUrl}
                    className="h-full w-full rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedLesson.content }}
              />
            </CardContent>
          </Card>
        ) : (
          <div className="text-center text-gray-500">
            {course.lessons.length === 0
              ? "No lessons available"
              : "Select a lesson to begin"}
          </div>
        )}
      </div>
    </div>
  )
}
