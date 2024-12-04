"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { apiClient } from "@/lib/api-client"
import { toast } from "@/components/ui/toast"
import { LoadingState } from "@/components/ui/loading-state"

interface Student {
  id: string
  name: string
  grade: number
  courses: Array<{
    id: string
    title: string
    progress: number
    grade: number
    attendance: number
    lastActive: Date
  }>
}

interface ParentDashboardProps {
  parentId: string
}

export function ParentDashboard({ parentId }: ParentDashboardProps) {
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStudents()
  }, [parentId])

  const fetchStudents = async () => {
    try {
      const data = await apiClient.get<Student[]>(`/api/parent/students?parentId=${parentId}`)
      setStudents(data)
      if (data.length > 0) {
        setSelectedStudent(data[0])
      }
    } catch (error) {
      console.error("Failed to fetch students:", error)
      toast({
        title: "Error",
        description: "Failed to load student data. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <LoadingState message="Loading student data..." size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Student Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Your Children</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            {students.map((student) => (
              <Button
                key={student.id}
                variant={selectedStudent?.id === student.id ? "default" : "outline"}
                onClick={() => setSelectedStudent(student)}
              >
                {student.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedStudent && (
        <>
          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle>{selectedStudent.name}&apos;s Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Grade Level</p>
                  <p className="text-2xl font-bold">Grade {selectedStudent.grade}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Active Courses</p>
                  <p className="text-2xl font-bold">
                    {selectedStudent.courses.length}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Average Grade</p>
                  <p className="text-2xl font-bold">
                    {selectedStudent.courses.reduce(
                      (acc, course) => acc + course.grade,
                      0
                    ) / selectedStudent.courses.length}
                    %
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Course Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={selectedStudent.courses}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="title" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="progress" fill="#8884d8" name="Progress %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Course Details */}
          <div className="grid gap-4 md:grid-cols-2">
            {selectedStudent.courses.map((course) => (
              <Card key={course.id}>
                <CardHeader>
                  <CardTitle>{course.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Current Grade</p>
                        <p className="text-xl font-bold">{course.grade}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Attendance</p>
                        <p className="text-xl font-bold">{course.attendance}%</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Active</p>
                      <p className="text-gray-700">
                        {new Date(course.lastActive).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">Progress</p>
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div
                          className="h-full rounded-full bg-blue-500"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
