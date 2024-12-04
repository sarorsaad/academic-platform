"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { loadStripe } from "@stripe/stripe-js"
import { Button } from "@/components/ui/button"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CheckoutButtonProps {
  courseId: string
  price: number
}

export function CheckoutButton({ courseId, price }: CheckoutButtonProps) {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)

  const handleCheckout = async () => {
    if (!session) {
      // Redirect to login
      window.location.href = "/login"
      return
    }

    setIsLoading(true)

    try {
      // Create Stripe checkout session
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId,
          userId: session.user.id,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create checkout session")
      }

      const { sessionId } = await response.json()

      // Redirect to Stripe checkout
      const stripe = await stripePromise
      const { error } = await stripe!.redirectToCheckout({
        sessionId,
      })

      if (error) {
        throw error
      }
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Failed to process checkout")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleCheckout} disabled={isLoading}>
      {isLoading ? "Processing..." : `Enroll for $${price}`}
    </Button>
  )
}
