import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { AlertCircle, CheckCircle2, Info, AlertTriangle, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const healthcareAlertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground border-border-color",
        success: "bg-success-light text-success border-success/30 [&>svg]:text-success",
        warning: "bg-warning-light text-warning border-warning/30 [&>svg]:text-warning",
        destructive: "bg-destructive-light text-destructive border-destructive/30 [&>svg]:text-destructive",
        info: "bg-info-light text-info border-info/30 [&>svg]:text-info",
        
        // Healthcare-specific alerts
        claim: "bg-blue-50 text-blue-800 border-blue-200 [&>svg]:text-blue-600",
        payment: "bg-green-50 text-green-800 border-green-200 [&>svg]:text-green-600",
        denial: "bg-red-50 text-red-800 border-red-200 [&>svg]:text-red-600",
        pending: "bg-amber-50 text-amber-800 border-amber-200 [&>svg]:text-amber-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const iconMap = {
  default: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  destructive: XCircle,
  info: Info,
  claim: Info,
  payment: CheckCircle2,
  denial: XCircle,
  pending: AlertCircle,
}

const HealthcareAlert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & 
  VariantProps<typeof healthcareAlertVariants> & {
    showIcon?: boolean
  }
>(({ className, variant = "default", showIcon = true, children, ...props }, ref) => {
  const Icon = iconMap[variant]
  
  return (
    <div
      ref={ref}
      role="alert"
      className={cn(healthcareAlertVariants({ variant }), className)}
      {...props}
    >
      {showIcon && <Icon className="h-4 w-4" />}
      <div className={cn(showIcon && "pl-7")}>{children}</div>
    </div>
  )
})
HealthcareAlert.displayName = "HealthcareAlert"

const HealthcareAlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
))
HealthcareAlertTitle.displayName = "HealthcareAlertTitle"

const HealthcareAlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
HealthcareAlertDescription.displayName = "HealthcareAlertDescription"

export { 
  HealthcareAlert, 
  HealthcareAlertTitle, 
  HealthcareAlertDescription,
  healthcareAlertVariants 
}