'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import LoadingButton from '@/components/ui/LoadingButton.jsx'
import AdminGuard from "@/lib/AdminGuard";
import TokenCheck from "@/lib/tokenCheck";

export default function StatsPage() {
    const [analytics, setAnalytics] = useState({
        activeUsers: 0,
        pageViews: 0,
        sessions: 0,
        topPages: [],
        realTimeUsers: 0,
        recentActivity: []
    })

    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [lastUpdated, setLastUpdated] = useState(new Date())
    const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true)
    const intervalRef = useRef(null)
    const mountedRef = useRef(true)

    // Create a fetch with timeout
    const fetchWithTimeout = async (url, options, timeout = 15000) => {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), timeout)

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            })
            clearTimeout(timeoutId)
            return response
        } catch (error) {
            clearTimeout(timeoutId)
            if (error.name === 'AbortError') {
                throw new Error('Request timeout - please try again')
            }
            throw error
        }
    }

    // Fetch analytics data with timeout
    const fetchAnalyticsData = async (isRealTime = false) => {
        if (!mountedRef.current) return

        try {
            console.log('Fetching analytics data...', { isRealTime })
            setError(null)

            const response = await fetchWithTimeout('/api/analytics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache'
                },
                body: JSON.stringify({
                    startDate: '30daysAgo',
                    endDate: 'today',
                    metrics: ['activeUsers', 'screenPageViews', 'sessions'],
                    realTime: isRealTime
                })
            }, 15000)

            if (!response.ok) {
                let errorMessage = 'Failed to fetch analytics'
                try {
                    const errorData = await response.json()
                    errorMessage = errorData.message || errorData.details || errorMessage
                } catch (e) {
                    errorMessage = `HTTP ${response.status}: ${response.statusText}`
                }
                throw new Error(errorMessage)
            }

            const data = await response.json()
            console.log('Analytics data received:', data)

            // Only update state if component is still mounted
            if (mountedRef.current) {
                setAnalytics(prevData => ({
                    activeUsers: data.activeUsers ?? prevData.activeUsers ?? 0,
                    pageViews: data.pageViews ?? prevData.pageViews ?? 0,
                    sessions: data.sessions ?? prevData.sessions ?? 0,
                    topPages: data.topPages ?? prevData.topPages ?? [],
                    realTimeUsers: data.realTimeUsers ?? prevData.realTimeUsers ?? 0,
                    recentActivity: data.recentActivity ?? prevData.recentActivity ?? [],
                    bounceRate: data.bounceRate ?? prevData.bounceRate,
                    avgSessionDuration: data.avgSessionDuration ?? prevData.avgSessionDuration,
                    trafficSources: data.trafficSources ?? prevData.trafficSources ?? []
                }))
                setLastUpdated(new Date())
                setIsLoading(false)
                console.log('Analytics data loaded successfully')
            }
        } catch (error) {
            console.error('Failed to fetch analytics:', error)
            if (mountedRef.current) {
                setError(error.message)
                setIsLoading(false)

                // Set fallback data only if no data exists
                if (analytics.activeUsers === 0 && analytics.pageViews === 0) {
                    setAnalytics({
                        activeUsers: 0,
                        pageViews: 0,
                        sessions: 0,
                        topPages: [],
                        realTimeUsers: 0,
                        recentActivity: [{
                            type: 'error',
                            description: 'Unable to load analytics data',
                            timestamp: new Date().toLocaleTimeString()
                        }]
                    })
                }
            }
        }
    }

    // Initial load
    useEffect(() => {
        mountedRef.current = true
        fetchAnalyticsData()

        return () => {
            mountedRef.current = false
        }
    }, []) // Empty dependency array - only run once

    // Set up real-time updates
    useEffect(() => {
        if (!isRealTimeEnabled) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
                intervalRef.current = null
            }
            return
        }

        // Clear any existing interval
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
        }

        // Set up interval for real-time updates
        intervalRef.current = setInterval(() => {
            if (mountedRef.current) {
                fetchAnalyticsData(true)
            }
        }, 30000) // Update every 30 seconds instead of 10

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
                intervalRef.current = null
            }
        }
    }, [isRealTimeEnabled]) // Only depend on isRealTimeEnabled

    // Manual refresh
    const handleRefresh = () => {
        if (isLoading) return // Prevent multiple simultaneous requests

        setIsLoading(true)
        setError(null)
        fetchAnalyticsData(true)
    }

    // Toggle real-time updates
    const toggleRealTime = () => {
        setIsRealTimeEnabled(prev => !prev)
    }

    // Format timestamp
    const formatLastUpdated = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour12: true,
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit'
        })
    }

    // Format duration
    const formatDuration = (seconds) => {
        if (!seconds) return 'N/A'
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}m ${secs}s`
    }

    if (isLoading && analytics.activeUsers === 0) {
        return (
            <div className="p-6 max-w-6xl mx-auto">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-green-700"></div>
                    <span className="ml-3 text-gray-600">Loading analytics data...</span>
                </div>
                {error && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-800 text-sm">Error: {error}</p>
                        <button
                            onClick={handleRefresh}
                            className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                        >
                            Retry
                        </button>
                    </div>
                )}
            </div>
        )
    }

    return (
        <>
            <TokenCheck />
            <AdminGuard>
                <div className="p-6 max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">Real-time Analytics</h1>

                        <div className="flex items-center space-x-4">
                            <div className="text-sm text-gray-600">
                                Last updated: {formatLastUpdated(lastUpdated)}
                            </div>

                            <LoadingButton
                                onClick={toggleRealTime}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isRealTimeEnabled
                                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {isRealTimeEnabled ? 'Real-time ON' : 'Real-time OFF'}
                            </LoadingButton>

                            <LoadingButton
                                onClick={handleRefresh}
                                disabled={isLoading}
                                className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 disabled:opacity-50 text-sm font-medium transition-colors"
                            >
                                {isLoading ? 'Refreshing...' : 'Refresh'}   
                            </LoadingButton>
                            <Link href="/admin">
                                <LoadingButton>
                                    <span className="text-sm">Admin Panel</span>
                                </LoadingButton>
                            </Link>
                        </div>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-center">
                                <span className="text-yellow-800 text-sm">
                                    ⚠️ Using mock data - Analytics connection issue: {error}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Real-time indicator */}
                    {isRealTimeEnabled && !error && (
                        <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-3"></div>
                            <span className="text-green-800 text-sm font-medium">
                                Live data updates every 30 seconds
                            </span>
                        </div>
                    )}

                    {/* Quick Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow-md border">
                            <h3 className="text-lg font-semibold text-gray-600 mb-2">Real-time Users</h3>
                            <p className="text-3xl font-bold text-red-600">{analytics.realTimeUsers}</p>
                            <p className="text-sm text-gray-500">Right now</p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md border">
                            <h3 className="text-lg font-semibold text-gray-600 mb-2">Active Users</h3>
                            <p className="text-3xl font-bold text-blue-600">{analytics.activeUsers}</p>
                            <p className="text-sm text-gray-500">Last 30 minutes</p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md border">
                            <h3 className="text-lg font-semibold text-gray-600 mb-2">Page Views</h3>
                            <p className="text-3xl font-bold text-green-600">{analytics.pageViews}</p>
                            <p className="text-sm text-gray-500">Last 30 days</p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md border">
                            <h3 className="text-lg font-semibold text-gray-600 mb-2">Sessions</h3>
                            <p className="text-3xl font-bold text-purple-600">{analytics.sessions}</p>
                            <p className="text-sm text-gray-500">Last 30 days</p>
                        </div>
                    </div>

                    {/* Additional Stats */}
                    {(analytics.bounceRate || analytics.avgSessionDuration) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {analytics.bounceRate && (
                                <div className="bg-white p-6 rounded-lg shadow-md border">
                                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Bounce Rate</h3>
                                    <p className="text-3xl font-bold text-orange-600">
                                        {(analytics.bounceRate * 100).toFixed(1)}%
                                    </p>
                                    <p className="text-sm text-gray-500">Percentage of single-page sessions</p>
                                </div>
                            )}

                            {analytics.avgSessionDuration && (
                                <div className="bg-white p-6 rounded-lg shadow-md border">
                                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Avg Session Duration</h3>
                                    <p className="text-3xl font-bold text-indigo-600">
                                        {formatDuration(analytics.avgSessionDuration)}
                                    </p>
                                    <p className="text-sm text-gray-500">Average time per session</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Recent Activity Feed */}
                    <div className="bg-white p-6 rounded-lg shadow-md border mb-8">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                            {analytics.recentActivity && analytics.recentActivity.length > 0 ? (
                                analytics.recentActivity.map((activity, index) => (
                                    <div key={activity.id || index} className="flex items-center justify-between py-2 border-b border-gray-100">
                                        <div className="flex items-center">
                                            <div className={`w-2 h-2 rounded-full mr-3 ${activity.type === 'login' ? 'bg-green-500' :
                                                activity.type === 'workout' ? 'bg-blue-500' :
                                                    activity.type === 'nutrition' ? 'bg-orange-500' :
                                                        activity.type === 'goal' ? 'bg-purple-500' :
                                                            activity.type === 'registration' ? 'bg-indigo-500' :
                                                                activity.type === 'error' ? 'bg-red-500' :
                                                                    'bg-gray-500'
                                                }`}></div>
                                            <span className="text-gray-700">{activity.description}</span>
                                        </div>
                                        <span className="text-xs text-gray-500">
                                            {typeof activity.timestamp === 'string' && activity.timestamp.includes('T')
                                                ? new Date(activity.timestamp).toLocaleTimeString()
                                                : activity.timestamp
                                            }
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-4">No recent activity</p>
                            )}
                        </div>
                    </div>

                    {/* Top Pages */}
                    <div className="bg-white p-6 rounded-lg shadow-md border mb-8">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Top Pages</h3>
                        <div className="space-y-3">
                            {analytics.topPages && analytics.topPages.length > 0 ? (
                                analytics.topPages.map((page, index) => (
                                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span className="font-medium text-gray-700">{page.page}</span>
                                        <div className="flex items-center space-x-3">
                                            <span className="text-green-800 font-semibold">{page.views} views</span>
                                            {page.percentage && (
                                                <span className="text-gray-500 text-sm">({page.percentage}%)</span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-4">No page data available</p>
                            )}
                        </div>
                    </div>

                    {/* Traffic Sources */}
                    {analytics.trafficSources && analytics.trafficSources.length > 0 && (
                        <div className="bg-white p-6 rounded-lg shadow-md border mb-8">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Traffic Sources</h3>
                            <div className="space-y-3">
                                {analytics.trafficSources.map((source, index) => (
                                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                                        <span className="font-medium text-gray-700">{source.source}</span>
                                        <div className="flex items-center space-x-3">
                                            <span className="text-green-600 font-semibold">{source.visitors} visitors</span>
                                            <span className="text-gray-500 text-sm">({source.percentage}%)</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* External Links */}
                    <div className="bg-white p-6 rounded-lg shadow-md border">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">External Analytics</h3>
                        <div className="space-y-3">
                            <a
                                href="https://analytics.google.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-blue-800">Google Analytics Dashboard</span>
                                    <span className="text-blue-600">→</span>
                                </div>
                                <p className="text-sm text-blue-600 mt-1">View detailed analytics and reports</p>
                            </a>

                            <a
                                href="https://search.google.com/search-console"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-green-800">Google Search Console</span>
                                    <span className="text-green-600">→</span>
                                </div>
                                <p className="text-sm text-green-600 mt-1">Monitor search performance and indexing</p>
                            </a>
                        </div>
                    </div>
                </div>
            </AdminGuard>
        </>
    )
}