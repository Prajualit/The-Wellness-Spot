// src/app/[...slug]/page.js (for App Router)
// OR pages/[...slug].js (for Pages Router)

'use client' // Only needed for App Router

import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function CatchAllNotFound() {
    const [mounted, setMounted] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleSearch = () => {
        if (searchQuery.trim()) {
            window.location.href = `/?search=${encodeURIComponent(searchQuery)}`
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch()
        }
    }

    const handleGoBack = () => {
        if (typeof window !== 'undefined' && window.history.length > 1) {
            window.history.back()
        } else {
            window.location.href = '/'
        }
    }

    if (!mounted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-gray-600">Loading...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-300 to-neutral-100 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full text-center">
                {/* 404 Animation */}
                <div className="mb-8">
                    <div className="relative inline-block">
                        <h1 className="text-6xl sm:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-black to-neutral-500 animate-pulse">
                            404
                        </h1>
                        <div className="absolute inset-0 text-6xl sm:text-9xl font-bold text-blue-200 opacity-30 blur-sm -z-10">
                            404
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                <div className="mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
                        Oops! Page Not Found
                    </h2>
                    <p className="text-base sm:text-lg text-gray-600 mb-6">
                        The page you're looking for doesn't exist or has been moved.
                    </p>
                    <p className="text-sm text-gray-500">
                        Don't worry, it happens to the best of us!
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                    <Link
                        href="/"
                        className="px-6 py-3 bg-neutral-600 text-white rounded-lg hover:bg-neutral-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                        🏠 Go Home
                    </Link>

                    <button
                        onClick={handleGoBack}
                        className="px-6 cursor-pointer py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        type="button"
                    >
                        ← Go Back
                    </button>

                    <Link
                        href="/dashboard"
                        className="px-6 py-3 bg-neutral-900 text-white hover:text-black rounded-lg hover:bg-neutral-300 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                        📊 Dashboard
                    </Link>
                </div>

                {/* Quick Links */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        Quick Links
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link
                            href="/"
                            className="p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-center group"
                        >
                            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200">🏠</div>
                            <div className="text-sm font-medium text-blue-800">Home</div>
                        </Link>

                        <Link
                            href="/dashboard"
                            className="p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-center group"
                        >
                            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200">📊</div>
                            <div className="text-sm font-medium text-green-800">Dashboard</div>
                        </Link>

                        <Link
                            href="/workout"
                            className="p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors text-center group"
                        >
                            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200">💪</div>
                            <div className="text-sm font-medium text-orange-800">Workout</div>
                        </Link>

                        <Link
                            href="/nutrition"
                            className="p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-center group"
                        >
                            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200">🥗</div>
                            <div className="text-sm font-medium text-purple-800">Nutrition</div>
                        </Link>
                    </div>
                </div>
                <div className="mt-8 text-center">
                    <p className="text-gray-500 text-sm">
                        Error Code: 404 | Page Not Found
                    </p>
                </div>
            </div>
        </div>
    )
}