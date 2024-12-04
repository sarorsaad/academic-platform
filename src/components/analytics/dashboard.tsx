"use client"

import { useEffect, useState } from "react"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AnalyticsDashboardProps {
  courseId?: string
  userId?: string
  isTeacher: boolean
}

interface ProgressData {
  date: string
  score: number
}

interface EngagementData {
  activity: string
  count: number
}

interface CompletionData {
  student: string
  progress: number
}

export function AnalyticsDashboard({
  courseId,
  userId,
  isTeacher,
}: AnalyticsDashboardProps) {
  const [progressData, setProgressData] = useState<ProgressData[]>([])
  const [engagementData, setEngagementData] = useState<EngagementData[]>([])
  const [completionData, setCompletionData] = useState<CompletionData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Fetch progress data
        const progressResponse = await fetch(
          `/api/analytics/progress?${
            courseId ? `courseId=${courseId}&` : ""
          }${userId ? `userId=${userId}` : ""}`
        )
        const progressData = await progressResponse.json()
        setProgressData(progressData)

        // Fetch engagement data
        const engagementResponse = await fetch(
          `/api/analytics/engagement?${
            courseId ? `courseId=${courseId}&` : ""
          }${userId ? `userId=${userId}` : ""}`
        )
        const engagementData = await engagementResponse.json()
        setEngagementData(engagementData)

        // For teachers, fetch completion data
        if (isTeacher && courseId) {
          const completionResponse = await fetch(
            `/api/analytics/completion?courseId=${courseId}`
          )
          const completionData = await completionResponse.json()
          setCompletionData(completionData)
        }
      } catch (error) {
        console.error("Failed to fetch analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [courseId, userId, isTeacher])

  if (loading) {
    return <div>Loading analytics...</div>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Progress Over Time */}
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Progress Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Engagement Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Engagement by Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="activity" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Course Completion (Teachers Only) */}
      {isTeacher && (
        <Card>
          <CardHeader>
            <CardTitle>Student Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={completionData}
                  layout="vertical"
                  margin={{ left: 100 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="student" type="category" />
                  <Tooltip />
                  <Bar dataKey="progress" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
