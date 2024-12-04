import { getServerSession } from "next-auth/next"
import { NextResponse } from "next/server"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { authOptions } from "@/lib/auth"

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== "TEACHER" && session.user.role !== "ADMIN")) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      )
    }

    const { fileName, fileType, courseId } = await req.json()

    const key = `courses/${courseId}/${Date.now()}-${fileName}`
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: key,
      ContentType: fileType,
    })

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 })

    return NextResponse.json({
      url,
      fields: {
        key,
      },
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { message: "Error generating upload URL" },
      { status: 500 }
    )
  }
}
