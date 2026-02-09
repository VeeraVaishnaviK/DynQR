'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, Eye, Globe, Smartphone, Monitor, TrendingUp } from 'lucide-react'
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

// Mock data
const scansOverTime = [
    { date: 'Feb 1', scans: 45 },
    { date: 'Feb 2', scans: 52 },
    { date: 'Feb 3', scans: 38 },
    { date: 'Feb 4', scans: 65 },
    { date: 'Feb 5', scans: 43 },
    { date: 'Feb 6', scans: 78 },
    { date: 'Feb 7', scans: 89 },
    { date: 'Feb 8', scans: 56 },
    { date: 'Feb 9', scans: 72 },
    { date: 'Feb 10', scans: 84 },
]

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

const topQRCodes = [
    { name: 'Website Link', scans: 89 },
    { name: 'Contact Card', scans: 67 },
    { name: 'WiFi Access', scans: 45 },
    { name: 'Product Page', scans: 34 },
]

export default function AnalyticsPage() {
    const stats = {
        totalScans: 622,
        uniqueScans: 489,
        scansToday: 84,
        avgScansPerDay: 62,
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
                        <div className="text-2xl font-bold">{stats.totalScans}</div>
                        <p className="text-xs text-muted-foreground">
                            All time
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Unique Scans</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.uniqueScans}</div>
                        <p className="text-xs text-muted-foreground">
                            Unique visitors
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Scans Today</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.scansToday}</div>
                        <p className="text-xs text-green-600">
                            +35% from yesterday
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Daily Scans</CardTitle>
                        <Globe className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.avgScansPerDay}</div>
                        <p className="text-xs text-muted-foreground">
                            Last 30 days
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
                                <AreaChart data={scansOverTime}>
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
                            {topQRCodes.map((qr, index) => (
                                <div key={qr.name} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-medium text-muted-foreground w-4">
                                            {index + 1}
                                        </span>
                                        <span className="font-medium">{qr.name}</span>
                                    </div>
                                    <span className="text-sm text-muted-foreground">{qr.scans} scans</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
