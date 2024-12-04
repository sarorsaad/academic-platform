"use client"

import { ParentDashboard } from "@/components/parent/parent-dashboard"

export default function ParentDashboardPage() {
  // In a real app, we would get this from the session
  const mockParentId = "p1"

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">Parent Dashboard</h1>
      <ParentDashboard parentId={mockParentId} />
    </div>
  )
}
