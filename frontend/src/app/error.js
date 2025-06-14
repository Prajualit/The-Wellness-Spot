// src/app/error.js
"use client";

import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global error caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* Error Icon */}
        <div className="mb-8">
          <div className="text-8xl mb-4">⚠️</div>
          <h1 className="text-4xl font-bold text-red-600 mb-4">
            Something Went Wrong
          </h1>
        </div>

        {/* Error Details */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Error Details
          </h2>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-700 text-sm font-mono">
              {error?.message || "An unexpected error occurred"}
            </p>
          </div>

          {process.env.NODE_ENV === "development" && error?.stack && (
            <details className="text-left">
              <summary className="cursor-pointer text-gray-600 hover:text-gray-800 mb-2">
                Show Error Stack (Development Only)
              </summary>
              <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-40 text-gray-700">
                {error.stack}
              </pre>
            </details>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <button
            onClick={reset}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-200"
          >
            🔄 Try Again
          </button>

          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-200"
          >
            🔃 Reload Page
          </button>

          <button
            onClick={() => (window.location.href = "/")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 duration-200"
          >
            🏠 Go Home
          </button>
        </div>

        {/* Help Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Need Help?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg text-center">
              <div className="text-2xl mb-2">📧</div>
              <h4 className="font-medium text-blue-800 mb-1">
                Contact Support
              </h4>
              <p className="text-sm text-blue-600">Get help from our team</p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg text-center">
              <div className="text-2xl mb-2">📚</div>
              <h4 className="font-medium text-green-800 mb-1">Documentation</h4>
              <p className="text-sm text-green-600">Check our help docs</p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg text-center">
              <div className="text-2xl mb-2">💬</div>
              <h4 className="font-medium text-purple-800 mb-1">Community</h4>
              <p className="text-sm text-purple-600">Ask the community</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            If this problem persists, please contact our support team.
          </p>
          <div className="mt-4 text-xl">
            <span className="animate-pulse">🔧</span>
            <span className="ml-2 text-gray-600">
              Our developers are on it!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
