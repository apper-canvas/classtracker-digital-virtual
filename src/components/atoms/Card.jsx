import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  children, 
  className, 
  variant = "default",
  ...props 
}, ref) => {
  const baseStyles = "rounded-lg border bg-white shadow-sm transition-all duration-200";
  
  const variants = {
    default: "border-gray-200 shadow-sm hover:shadow-md",
    elevated: "border-gray-200 shadow-lg hover:shadow-xl",
    interactive: "border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1 cursor-pointer",
    gradient: "bg-gradient-to-br from-white to-gray-50 border-gray-200 shadow-lg"
  };

  return (
    <div
      ref={ref}
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;