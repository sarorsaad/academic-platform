import { Inter } from "next/font/google"
import { ClientLayout } from "@/components/layout/client-layout"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "EduPlatform - Online Learning Platform",
  description: "A comprehensive online learning platform for students from Grades 1 to 12",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <ClientLayout>
          <div className="min-h-full">
            <main>{children}</main>
          </div>
        </ClientLayout>
      </body>
    </html>
  )
}
