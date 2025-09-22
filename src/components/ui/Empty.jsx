import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No data found", 
  message = "There's nothing to display right now.", 
  actionLabel,
  onAction,
  icon = "FileText",
  className = "" 
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <div className="mb-4 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full">
        <ApperIcon name={icon} className="h-12 w-12 text-gray-400" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      
      <p className="text-gray-600 mb-6 max-w-md">{message}</p>
      
      {actionLabel && onAction && (
        <Button 
          onClick={onAction}
          variant="primary"
          className="flex items-center space-x-2"
        >
          <ApperIcon name="Plus" className="h-4 w-4" />
          <span>{actionLabel}</span>
        </Button>
      )}
    </div>
  );
};

export default Empty;