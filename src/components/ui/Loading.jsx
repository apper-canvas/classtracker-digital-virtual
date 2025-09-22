import React from "react";
import { motion } from "framer-motion";

const Loading = ({ type = "skeleton", className = "" }) => {
  if (type === "spinner") {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <motion.div
          className="h-8 w-8 rounded-full border-4 border-gray-200 border-t-primary-500"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <div className={`space-y-4 p-6 ${className}`}>
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse" />
          <div className="h-4 w-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded-md animate-pulse" />
        </div>
        <div className="h-10 w-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse" />
      </div>

      {/* Content skeleton */}
      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start space-x-4">
              <div className="h-16 w-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse flex-shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="space-y-2">
                  <div className="h-5 w-3/4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="h-3 w-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse" />
                    <div className="h-6 w-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse" />
                    <div className="h-6 w-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;