import React from "react";

interface LoadingSkeletonProps {
  rows?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ rows = 10 }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-b border-[#2b2f36] animate-pulse">
          {/* Star */}
          <td className="px-3 sm:px-4 py-3 w-10">
            <div className="w-4 h-4 bg-[#2b2f36] rounded" />
          </td>
          {/* Symbol */}
          <td className="px-3 sm:px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="hidden sm:block w-7 h-7 bg-[#2b2f36] rounded-full shrink-0" />
              <div className="w-20 h-4 bg-[#2b2f36] rounded" />
            </div>
          </td>
          {/* Price */}
          <td className="px-3 sm:px-4 py-3">
            <div className="w-24 h-4 bg-[#2b2f36] rounded" />
          </td>
          {/* Change 24h */}
          <td className="px-3 sm:px-4 py-3">
            <div className="w-16 h-6 bg-[#2b2f36] rounded" />
          </td>
          {/* High */}
          <td className="px-3 sm:px-4 py-3 hidden md:table-cell">
            <div className="w-20 h-4 bg-[#2b2f36] rounded" />
          </td>
          {/* Low */}
          <td className="px-3 sm:px-4 py-3 hidden md:table-cell">
            <div className="w-20 h-4 bg-[#2b2f36] rounded" />
          </td>
          {/* Volume */}
          <td className="px-3 sm:px-4 py-3 hidden lg:table-cell text-right">
            <div className="w-20 h-4 bg-[#2b2f36] rounded ml-auto" />
          </td>
        </tr>
      ))}
    </>
  );
};

export default LoadingSkeleton;
