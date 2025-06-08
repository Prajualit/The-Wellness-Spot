'use client'

import { useState, useEffect, useRef } from 'react'

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
    const fetchWithTimeout = async (url, options, timeout = 10000) => {
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
            throw error
        }
    }

    // Fetch analytics data with timeout
    const fetchAnalyticsData = async (isRealTime = false) => {
        try {
            console.log('Fetching analytics data...')
            setError(null)

            const response = await fetchWithTimeout('/api/analytics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    startDate: '30daysAgo',
                    endDate: 'today',
                    metrics: ['activeUsers', 'screenPageViews', 'sessions'],
                    realTime: isRealTime
                })
            }, 15000) // 15 second timeout

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.details || 'Failed to fetch analytics')
            }

            const data = await response.json()

            // Only update state if component is still mounted
            if (mountedRef.current) {
                setAnalytics(prevData => ({
                    ...prevData,
                    ...data,
                    // Keep previous data if new data is incomplete
                    activeUsers: data.activeUsers ?? prevData.activeUsers,
                    pageViews: data.pageViews ?? prevData.pageViews,
                    sessions: data.sessions ?? prevData.sessions,
                    topPages: data.topPages ?? prevData.topPages,
                    realTimeUsers: data.realTimeUsers ?? prevData.realTimeUsers,
                    recentActivity: data.recentActivity ?? prevData.recentActivity
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

                // Set fallback data if no data exists
                if (analytics.activeUsers === 0) {
                    setAnalytics({
                        activeUsers: 0,
                        pageViews: 0,
                        sessions: 0,
                        topPages: [],
                        realTimeUsers: 0,
                        recentActivity: [{
                            type: 'error',
                            description: 'Unable to load data',
                            timestamp: new Date().toLocaleTimeString()
                        }]
                    })
                }
            }
        }
    }

    // Fetch real-time data specifically
    const fetchRealTimeData = async () => {
        try {
            const response = await fetchWithTimeout('/api/analytics/realtime', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }, 10000)

            if (!response.ok) throw new Error('Failed to fetch real-time data')

            const data = await response.json()

            if (mountedRef.current) {
                setAnalytics(prevData => ({
                    ...prevData,
                    realTimeUsers: data.realTimeUsers ?? prevData.realTimeUsers,
                    recentActivity: data.recentActivity ?? prevData.recentActivity
                }))
                setLastUpdated(new Date())
            }
        } catch (error) {
            console.error('Failed to fetch real-time data:', error)
        }
    }

    // Initial load
    useEffect(() => {
        fetchAnalyticsData()

        return () => {
            mountedRef.current = false
        }
    }, [])

    // Set up real-time updates
    useEffect(() => {
        if (isRealTimeEnabled) {
            // Fetch real-time data every 10 seconds
            intervalRef.current = setInterval(() => {
                fetchRealTimeData()
            }, 10000)

            // Fetch full analytics data every 5 minutes
            const fullDataInterval = setInterval(() => {
                fetchAnalyticsData(true)
            }, 300000)

            return () => {
                if (intervalRef.current) clearInterval(intervalRef.current)
                if (fullDataInterval) clearInterval(fullDataInterval)
            }
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
                intervalRef.current = null
            }
        }
    }, [isRealTimeEnabled])

    // Manual refresh
    const handleRefresh = () => {
        setIsLoading(true)
        setError(null)
        fetchAnalyticsData(true)
    }

    // Toggle real-time updates
    const toggleRealTime = () => {
        setIsRealTimeEnabled(!isRealTimeEnabled)
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

    if (isLoading && analytics.activeUsers === 0) {
        return (
            <div className="p-6 max-w-6xl mx-auto">
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
        <div className="p-6 max-w-6xl mx-auto">
            {/* Header with controls */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Real-time Analytics</h1>

                <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-600">
                        Last updated: {formatLastUpdated(lastUpdated)}
                    </div>

                    <button
                        onClick={toggleRealTime}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isRealTimeEnabled
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {isRealTimeEnabled ? 'Real-time ON' : 'Real-time OFF'}
                    </button>

                    <button
                        onClick={handleRefresh}
                        disabled={isLoading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium transition-colors"
                    >
                        {isLoading ? 'Refreshing...' : 'Refresh'}
                    </button>
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
                        Live data updates every 10 seconds
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

            {/* Recent Activity Feed */}
            <div className="bg-white p-6 rounded-lg shadow-md border mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                    {analytics.recentActivity && analytics.recentActivity.length > 0 ? (
                        analytics.recentActivity.map((activity, index) => (
                            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100">
                                <div className="flex items-center">
                                    <div className={`w-2 h-2 rounded-full mr-3 ${activity.type === 'login' ? 'bg-green-500' :
                                        activity.type === 'workout' ? 'bg-blue-500' :
                                            activity.type === 'nutrition' ? 'bg-orange-500' :
                                                activity.type === 'error' ? 'bg-red-500' :
                                                    'bg-gray-500'
                                        }`}></div>
                                    <span className="text-gray-700">{activity.description}</span>
                                </div>
                                <span className="text-xs text-gray-500">{activity.timestamp}</span>
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
                                <span className="text-blue-600 font-semibold">{page.views} views</span>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-4">No page data available</p>
                    )}
                </div>
            </div>

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
    )
}