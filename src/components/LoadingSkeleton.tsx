import React from "react";

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 px-4 py-3">
          <div className="w-6 h-6 bg-gray-700 rounded" />
          <div className="w-24 h-4 bg-gray-700 rounded" />
          <div className="w-20 h-4 bg-gray-700 rounded" />
          <div className="w-16 h-4 bg-gray-700 rounded" />
          <div className="w-20 h-4 bg-gray-700 rounded hidden md:block" />
          <div className="w-20 h-4 bg-gray-700 rounded hidden md:block" />
          <div className="w-16 h-4 bg-gray-700 rounded hidden lg:block" />
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
