"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function StudentDashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">4</div>
          <p className="text-xs text-gray-500">+2 from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">85%</div>
          <p className="text-xs text-gray-500">+2.5% from last month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12</div>
          <p className="text-xs text-gray-500">+3 since last week</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Learning Hours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">24.5</div>
          <p className="text-xs text-gray-500">+5 hours from last week</p>
        </CardContent>
      </Card>

      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium">Completed Math Quiz</p>
                <p className="text-sm text-gray-500">Score: 90%</p>
              </div>
              <div className="ml-auto font-medium">Today</div>
            </div>
            <div className="flex items-center">
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium">Watched Science Lecture</p>
                <p className="text-sm text-gray-500">Chapter 5: Chemical Reactions</p>
              </div>
              <div className="ml-auto font-medium">Yesterday</div>
            </div>
            <div className="flex items-center">
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium">Submitted English Assignment</p>
                <p className="text-sm text-gray-500">Essay on Shakespeare</p>
              </div>
              <div className="ml-auto font-medium">2 days ago</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
