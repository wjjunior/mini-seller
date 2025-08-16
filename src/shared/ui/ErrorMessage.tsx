import React from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message = "Something went wrong. Please try again.",
  onRetry,
  className = "",
}) => {
  return (
    <div className={`text-center py-8 ${className}`}>
      <div className="flex items-center justify-center mb-4">
        <ExclamationTriangleIcon className="w-8 h-8 text-red-500" data-testid="error-icon" />
      </div>
      <p className="text-red-600 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
