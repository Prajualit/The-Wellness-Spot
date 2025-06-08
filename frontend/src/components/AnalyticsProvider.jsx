// src/components/AnalyticsProvider.jsx
'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import * as gtag from '@/lib/gtag'

export default function AnalyticsProvider({ children }) {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        if (gtag.GA_TRACKING_ID) {
            const url = pathname + searchParams.toString()
            gtag.pageview(url)
        }
    }, [pathname, searchParams])

    return <>{children}</>
}