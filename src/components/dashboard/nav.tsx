"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface NavProps {
  role: string
}

export function DashboardNav({ role }: NavProps) {
  const pathname = usePathname()

  const studentLinks = [
    {
      title: "Overview",
      href: "/dashboard",
      icon: "home",
    },
    {
      title: "My Courses",
      href: "/dashboard/courses",
      icon: "book",
    },
    {
      title: "Assignments",
      href: "/dashboard/assignments",
      icon: "file",
    },
    {
      title: "Progress",
      href: "/dashboard/progress",
      icon: "chart",
    },
  ]

  const teacherLinks = [
    {
      title: "Overview",
      href: "/dashboard",
      icon: "home",
    },
    {
      title: "My Courses",
      href: "/dashboard/courses",
      icon: "book",
    },
    {
      title: "Students",
      href: "/dashboard/students",
      icon: "users",
    },
    {
      title: "Assignments",
      href: "/dashboard/assignments",
      icon: "file",
    },
    {
      title: "Analytics",
      href: "/dashboard/analytics",
      icon: "chart",
    },
  ]

  const adminLinks = [
    {
      title: "Overview",
      href: "/dashboard",
      icon: "home",
    },
    {
      title: "Users",
      href: "/dashboard/users",
      icon: "users",
    },
    {
      title: "Courses",
      href: "/dashboard/courses",
      icon: "book",
    },
    {
      title: "Reports",
      href: "/dashboard/reports",
      icon: "chart",
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: "settings",
    },
  ]

  const links = role === "ADMIN" 
    ? adminLinks 
    : role === "TEACHER" 
    ? teacherLinks 
    : studentLinks

  return (
    <nav className="grid items-start gap-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100",
            pathname === link.href ? "bg-gray-100" : "transparent"
          )}
        >
          <span>{link.title}</span>
        </Link>
      ))}
    </nav>
  )
}
