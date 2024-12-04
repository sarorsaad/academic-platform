import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadingStateProps {
  className?: string
  message?: string
  size?: "sm" | "md" | "lg"
}

export function LoadingState({
  className,
  message = "Loading...",
  size = "md",
}: LoadingStateProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center space-y-2 p-4",
        className
      )}
    >
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      {message && (
        <p className="text-sm text-muted-foreground animate-pulse">{message}</p>
      )}
    </div>
  )
}

interface LoadingOverlayProps extends LoadingStateProps {
  show: boolean
}

export function LoadingOverlay({
  show,
  className,
  message,
  size,
}: LoadingOverlayProps) {
  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <LoadingState className={className} message={message} size={size} />
    </div>
  )
}
