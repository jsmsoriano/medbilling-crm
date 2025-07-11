import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      status: {
        // Claim Status Variants
        submitted: "bg-status-submitted text-white border-transparent shadow-sm",
        approved: "bg-status-approved text-white border-transparent shadow-sm",
        pending: "bg-status-pending text-white border-transparent shadow-sm",
        denied: "bg-status-denied text-white border-transparent shadow-sm",
        review: "bg-status-review text-white border-transparent shadow-sm",
        resubmitted: "bg-status-resubmitted text-white border-transparent shadow-sm",
        
        // Light variants for better readability in certain contexts
        "submitted-light": "bg-blue-50 text-blue-700 border-blue-200",
        "approved-light": "bg-green-50 text-green-700 border-green-200",
        "pending-light": "bg-amber-50 text-amber-700 border-amber-200",
        "denied-light": "bg-red-50 text-red-700 border-red-200",
        "review-light": "bg-purple-50 text-purple-700 border-purple-200",
        "resubmitted-light": "bg-cyan-50 text-cyan-700 border-cyan-200",
      },
    },
    defaultVariants: {
      status: "submitted",
    },
  }
)

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {}

function StatusBadge({ className, status, ...props }: StatusBadgeProps) {
  return (
    <div className={cn(statusBadgeVariants({ status }), className)} {...props} />
  )
}

export { StatusBadge, statusBadgeVariants }