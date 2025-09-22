import React, { useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const SearchBar = ({ 
  placeholder = "Search...", 
  onSearch, 
  className,
  value: controlledValue,
  onChange: controlledOnChange 
}) => {
  const [internalValue, setInternalValue] = useState("");
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const handleChange = (e) => {
    const newValue = e.target.value;
    
    if (isControlled) {
      controlledOnChange?.(newValue);
    } else {
      setInternalValue(newValue);
    }
    
    if (onSearch) {
      onSearch(newValue);
    }
  };

  const handleClear = () => {
    const newValue = "";
    
    if (isControlled) {
      controlledOnChange?.(newValue);
    } else {
      setInternalValue(newValue);
    }
    
    if (onSearch) {
      onSearch(newValue);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <ApperIcon 
        name="Search" 
        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" 
      />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className="flex h-10 w-full rounded-lg border border-gray-300 bg-white pl-9 pr-9 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <ApperIcon name="X" className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;