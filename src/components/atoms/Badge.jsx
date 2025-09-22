import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  children, 
  className, 
  variant = "default",
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-all duration-200";
  
  const variants = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-gradient-to-r from-success-100 to-success-200 text-success-800 border border-success-200",
    warning: "bg-gradient-to-r from-warning-100 to-warning-200 text-warning-800 border border-warning-200",
    error: "bg-gradient-to-r from-error-100 to-error-200 text-error-800 border border-error-200",
    info: "bg-gradient-to-r from-info-100 to-info-200 text-info-800 border border-info-200",
    primary: "bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 border border-primary-200"
  };

  return (
    <span
      ref={ref}
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;