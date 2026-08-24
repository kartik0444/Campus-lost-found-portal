import React from 'react';

const LoadingSpinner = ({ message = 'Loading campus items...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin"></div>
        <div className="absolute w-6 h-6 rounded-full bg-blue-50"></div>
      </div>
      {message && (
        <p className="mt-4 text-sm font-medium text-slate-500 animate-pulse">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
