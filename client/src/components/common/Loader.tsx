import React from "react";

const Loader: React.FC = () => {
  return (
    <div
      className="flex items-center justify-center min-h-screen"
      role="status"
      aria-label="Loading"
    >
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Loader;
