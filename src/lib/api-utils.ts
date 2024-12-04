import { NextResponse } from "next/server"
import { ZodError } from "zod"
import { prisma } from "@/lib/prisma"

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public data?: any
  ) {
    super(message)
    this.name = "ApiError"
  }
}

type ApiHandler = (
  req: Request,
  context: { params: any }
) => Promise<Response> | Response

export function withErrorHandler(handler: ApiHandler): ApiHandler {
  return async (req: Request, context: { params: any }) => {
    try {
      const response = await handler(req, context)
      return response
    } catch (error: any) {
      console.error("API Error:", error)

      if (error instanceof ApiError) {
        return NextResponse.json(
          {
            error: error.message,
            data: error.data,
          },
          { status: error.statusCode }
        )
      }

      if (error instanceof ZodError) {
        return NextResponse.json(
          {
            error: "Validation Error",
            details: error.errors,
          },
          { status: 400 }
        )
      }

      if (error.code === "P2002") {
        return NextResponse.json(
          {
            error: "Unique constraint violation",
            field: error.meta?.target?.[0],
          },
          { status: 409 }
        )
      }

      // Handle other Prisma errors
      if (error.code?.startsWith("P")) {
        return NextResponse.json(
          {
            error: "Database Error",
            message: error.message,
          },
          { status: 500 }
        )
      }

      return NextResponse.json(
        {
          error: "Internal Server Error",
          message: process.env.NODE_ENV === "development" ? error.message : undefined,
        },
        { status: 500 }
      )
    }
  }
}

export async function withDb<T>(
  operation: (prisma: typeof prisma) => Promise<T>
): Promise<T> {
  try {
    return await operation(prisma)
  } catch (error: any) {
    if (error.code === "P2025") {
      throw new ApiError("Resource not found", 404)
    }
    throw error
  }
}

export function validateMethod(req: Request, allowedMethods: string[]) {
  if (!allowedMethods.includes(req.method!)) {
    throw new ApiError(
      `Method ${req.method} not allowed. Allowed methods: ${allowedMethods.join(
        ", "
      )}`,
      405
    )
  }
}

export async function parseBody<T>(req: Request): Promise<T> {
  try {
    return await req.json()
  } catch (error) {
    throw new ApiError("Invalid JSON body", 400)
  }
}
