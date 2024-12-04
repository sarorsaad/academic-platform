import { forwardRef } from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link"
  size?: "sm" | "md" | "lg"
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:ring-indigo-600":
              variant === "primary",
            "bg-white text-gray-900 hover:bg-gray-50 focus-visible:ring-gray-900":
              variant === "secondary",
            "border border-gray-300 bg-transparent hover:bg-gray-50 focus-visible:ring-gray-900":
              variant === "outline",
            "hover:bg-gray-50 hover:text-gray-900 focus-visible:ring-gray-900": variant === "ghost",
            "text-indigo-600 underline-offset-4 hover:underline focus-visible:ring-indigo-600":
              variant === "link",
          },
          {
            "h-9 px-3 text-sm": size === "sm",
            "h-10 px-4 py-2": size === "md",
            "h-11 px-8 text-lg": size === "lg",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
