"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface AutoGraderProps {
  assignmentId: string
  submissionId: string
  isTeacher: boolean
}

interface RubricItem {
  id: string
  criterion: string
  maxPoints: number
  weight: number
}

interface FeedbackItem {
  criterion: string
  score: number
  feedback: string
  suggestions: string[]
}

export function AutoGrader({
  assignmentId,
  submissionId,
  isTeacher,
}: AutoGraderProps) {
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<FeedbackItem[]>([])
  const [rubric, setRubric] = useState<RubricItem[]>([])
  const [showRubricEditor, setShowRubricEditor] = useState(false)
  const [newCriterion, setNewCriterion] = useState("")
  const [newMaxPoints, setNewMaxPoints] = useState("")
  const [newWeight, setNewWeight] = useState("")

  const gradeSubmission = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/grading/auto-grade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assignmentId,
          submissionId,
          rubric,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to grade submission")
      }

      const data = await response.json()
      setFeedback(data.feedback)
    } catch (error) {
      console.error("Grading error:", error)
    } finally {
      setLoading(false)
    }
  }

  const addRubricItem = () => {
    if (!newCriterion || !newMaxPoints || !newWeight) return

    const newItem: RubricItem = {
      id: Math.random().toString(),
      criterion: newCriterion,
      maxPoints: parseInt(newMaxPoints),
      weight: parseInt(newWeight),
    }

    setRubric([...rubric, newItem])
    setNewCriterion("")
    setNewMaxPoints("")
    setNewWeight("")
  }

  const removeRubricItem = (id: string) => {
    setRubric(rubric.filter((item) => item.id !== id))
  }

  const saveRubric = async () => {
    try {
      await fetch(`/api/assignments/${assignmentId}/rubric`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rubric }),
      })
      setShowRubricEditor(false)
    } catch (error) {
      console.error("Failed to save rubric:", error)
    }
  }

  return (
    <div className="space-y-6">
      {isTeacher && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Grading Rubric</CardTitle>
              <Button
                onClick={() => setShowRubricEditor(!showRubricEditor)}
              >
                {showRubricEditor ? "Hide Editor" : "Edit Rubric"}
              </Button>
            </div>
          </CardHeader>
          {showRubricEditor && (
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <Input
                    placeholder="Criterion"
                    value={newCriterion}
                    onChange={(e) => setNewCriterion(e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Max Points"
                    value={newMaxPoints}
                    onChange={(e) => setNewMaxPoints(e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Weight (%)"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                  />
                </div>
                <Button onClick={addRubricItem}>Add Criterion</Button>
                <div className="space-y-2">
                  {rubric.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div>
                        <p className="font-medium">{item.criterion}</p>
                        <p className="text-sm text-gray-500">
                          Max Points: {item.maxPoints} | Weight: {item.weight}%
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        onClick={() => removeRubricItem(item.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
                <Button onClick={saveRubric}>Save Rubric</Button>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Automated Grading</CardTitle>
            <Button onClick={gradeSubmission} disabled={loading}>
              {loading ? "Grading..." : "Grade Submission"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {feedback.length > 0 ? (
            <div className="space-y-6">
              {feedback.map((item, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="font-medium">{item.criterion}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold">
                      {item.score}
                    </span>
                    <span className="text-gray-500">points</span>
                  </div>
                  <p className="text-gray-700">{item.feedback}</p>
                  {item.suggestions.length > 0 && (
                    <div className="mt-2">
                      <h4 className="font-medium">Suggestions for Improvement:</h4>
                      <ul className="list-inside list-disc">
                        {item.suggestions.map((suggestion, i) => (
                          <li key={i} className="text-gray-600">
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              Click "Grade Submission" to start automated grading
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
