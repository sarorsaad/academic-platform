"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface Question {
  id: string
  text: string
  options: string[]
  correctOption: number
}

interface QuizProps {
  courseId: string
  lessonId: string
  questions: Question[]
  onComplete: (score: number) => void
}

export function Quiz({ courseId, lessonId, questions, onComplete }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)

  const handleAnswer = (answer: number) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answer
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculateScore()
    }
  }

  const calculateScore = async () => {
    const correctAnswers = questions.reduce((count, question, index) => {
      return count + (answers[index] === question.correctOption ? 1 : 0)
    }, 0)

    const finalScore = (correctAnswers / questions.length) * 100

    // Save quiz result
    try {
      await fetch("/api/assessments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId,
          lessonId,
          score: finalScore,
          answers,
        }),
      })
    } catch (error) {
      console.error("Failed to save quiz result:", error)
    }

    setScore(finalScore)
    setShowResults(true)
    onComplete(finalScore)
  }

  if (showResults) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-center">
            <p className="text-2xl font-bold">
              Your Score: {score.toFixed(1)}%
            </p>
            <p>
              You got {answers.filter((answer, index) => answer === questions[index].correctOption).length}{" "}
              out of {questions.length} questions correct
            </p>
            <Button onClick={() => window.location.reload()}>
              Retake Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const question = questions[currentQuestion]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Question {currentQuestion + 1} of {questions.length}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <p className="text-lg">{question.text}</p>
          <RadioGroup
            value={answers[currentQuestion]?.toString()}
            onValueChange={(value) => handleAnswer(parseInt(value))}
          >
            {question.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <label htmlFor={`option-${index}`} className="text-sm">
                  {option}
                </label>
              </div>
            ))}
          </RadioGroup>
          <Button
            onClick={handleNext}
            disabled={answers[currentQuestion] === undefined}
            className="w-full"
          >
            {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
