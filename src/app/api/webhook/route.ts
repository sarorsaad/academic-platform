import { headers } from "next/headers"
import { NextResponse } from "next/server"
import Stripe from "stripe"
import { prisma } from "@/lib/prisma"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const signature = headers().get("stripe-signature")!

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    )

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session

      // Create enrollment
      await prisma.enrollment.create({
        data: {
          courseId: session.metadata!.courseId,
          studentId: session.metadata!.userId,
          status: "ACTIVE",
          paymentId: session.id,
        },
      })

      // Create payment record
      await prisma.payment.create({
        data: {
          stripeSessionId: session.id,
          amount: session.amount_total! / 100, // Convert from cents
          currency: session.currency!,
          status: "COMPLETED",
          courseId: session.metadata!.courseId,
          userId: session.metadata!.userId,
        },
      })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json(
      { message: "Webhook error" },
      { status: 400 }
    )
  }
}
