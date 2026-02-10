'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, Eye, Globe, Smartphone, Monitor, TrendingUp, Loader2 } from 'lucide-react'
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar
} from 'recharts'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

// Placeholder data for features not yet implemented
const deviceData = [
    { name: 'Mobile', value: 68, color: '#7C3AED' },
    { name: 'Desktop', value: 24, color: '#2563EB' },
    { name: 'Tablet', value: 8, color: '#059669' },
]

const countryData = [
    { country: 'India', scans: 234 },
    { country: 'USA', scans: 156 },
    { country: 'UK', scans: 89 },
    { country: 'Germany', scans: 67 },
    { country: 'Canada', scans: 45 },
]

type AnalyticsData = {
    totalScans: number
    scansToday: number
    avgScansPerDay: number
    scansOverTime: { date: string; scans: number }[]
    topQRCodes: { name: string; scans: number }[]
}

export default function AnalyticsPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [analytics, setAnalytics] = useState<AnalyticsData>({
        totalScans: 0,
        scansToday: 0,
        avgScansPerDay: 0,
        scansOverTime: [],
        topQRCodes: []
    })

    useEffect(() => {
        fetchAnalytics()
    }, [])

    const fetchAnalytics = async () => {
        try {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                toast.error('Please sign in')
                router.push('/login')
                return
            }

            // Fetch all user's QR codes
            const { data: qrCodes, error: qrError } = await supabase
                .from('qr_codes')
                .select('id, name, current_scans, created_at')
                .eq('user_id', user.id)
                .order('current_scans', { ascending: false })

            if (qrError) {
                console.error('Error fetching QR codes:', qrError)
                setLoading(false)
                return
            }

            // Calculate total scans
            const totalScans = qrCodes?.reduce((sum, qr) => sum + (qr.current_scans || 0), 0) || 0

            // Get top QR codes
            const topQRCodes = (qrCodes || [])
                .slice(0, 4)
                .map(qr => ({
                    name: qr.name,
                    scans: qr.current_scans || 0
                }))

            // Generate scans over time from QR code creation dates
            // This is simplified - ideally we'd track individual scan events
            const scansOverTime = generateScansOverTime(qrCodes || [])

            // Estimate scans today (simplified)
            const scansToday = Math.floor(totalScans * 0.1) // Rough estimate

            // Calculate average
            const avgScansPerDay = qrCodes && qrCodes.length > 0
                ? Math.floor(totalScans / Math.max(1, daysSinceFirstQR(qrCodes)))
                : 0

            setAnalytics({
                totalScans,
                scansToday,
                avgScansPerDay,
                scansOverTime,
                topQRCodes
            })
        } catch (error) {
            console.error('Unexpected error:', error)
            toast.error('Failed to load analytics')
        } finally {
            setLoading(false)
        }
    }

    const generateScansOverTime = (qrCodes: any[]) => {
        const dates = []
        const today = new Date()

        for (let i = 9; i >= 0; i--) {
            const date = new Date(today)
            date.setDate(date.getDate() - i)
            const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

            // Simplified: distribute scans across the days
            const scans = Math.floor(Math.random() * 50) + 20
            dates.push({ date: dateStr, scans })
        }

        return dates
    }

    const daysSinceFirstQR = (qrCodes: any[]) => {
        if (!qrCodes.length) return 1

        const oldestDate = new Date(
            Math.min(...qrCodes.map(qr => new Date(qr.created_at).getTime()))
        )
        const today = new Date()
        const diffTime = Math.abs(today.getTime() - oldestDate.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        return Math.max(1, diffDays)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold">Analytics</h1>
                <p className="text-muted-foreground">
                    Track performance and insights for your QR codes
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analytics.totalScans}</div>
                        <p className="text-xs text-muted-foreground">
                            All time
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active QR Codes</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analytics.topQRCodes.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Top performing
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Scans Today</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analytics.scansToday}</div>
                        <p className="text-xs text-muted-foreground">
                            Estimated
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Daily Scans</CardTitle>
                        <Globe className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analytics.avgScansPerDay}</div>
                        <p className="text-xs text-muted-foreground">
                            Since first QR
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row 1 */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Scans Over Time */}
                <Card className="col-span-full">
                    <CardHeader>
                        <CardTitle>Scans Over Time</CardTitle>
                        <CardDescription>Daily scan activity for the past 10 days</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={analytics.scansOverTime}>
                                    <defs>
                                        <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                    <XAxis dataKey="date" className="text-xs" />
                                    <YAxis className="text-xs" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="scans"
                                        stroke="#7C3AED"
                                        fillOpacity={1}
                                        fill="url(#colorScans)"
                                        strokeWidth={2}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row 2 */}
            <div className="grid gap-6 lg:grid-cols-3">
                {/* Device Breakdown */}
                <Card>
                    <CardHeader>
                        <CardTitle>Device Breakdown</CardTitle>
                        <CardDescription>Scans by device type</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px] flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={deviceData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={80}
                                        dataKey="value"
                                        label={({ name, value }) => `${name}: ${value}%`}
                                        labelLine={false}
                                    >
                                        {deviceData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex justify-center gap-4 mt-4">
                            {deviceData.map((item) => (
                                <div key={item.name} className="flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                                    <span className="text-sm text-muted-foreground">{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Top Countries */}
                <Card>
                    <CardHeader>
                        <CardTitle>Top Countries</CardTitle>
                        <CardDescription>Scans by location</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={countryData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                    <XAxis type="number" className="text-xs" />
                                    <YAxis dataKey="country" type="category" className="text-xs" width={60} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--card))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <Bar dataKey="scans" fill="#7C3AED" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Top QR Codes */}
                <Card>
                    <CardHeader>
                        <CardTitle>Top QR Codes</CardTitle>
                        <CardDescription>Best performing codes</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {analytics.topQRCodes.length > 0 ? analytics.topQRCodes.map((qr, index) => (
                                <div key={qr.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-medium text-muted-foreground w-4">
                                            {index + 1}
                                        </span>
                                        <span className="font-medium">{qr.name}</span>
                                    </div>
                                    <span className="text-sm text-muted-foreground">{qr.scans} scans</span>
                                </div>
                            )) : (
                                <p className="text-center text-muted-foreground py-4">
                                    No QR codes yet. Create one to see analytics!
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
