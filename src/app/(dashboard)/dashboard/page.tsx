import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { QrCode, BarChart3, Eye, TrendingUp, Plus } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // For demo purposes, using mock data
    const stats = {
        totalQRCodes: 3,
        totalScans: 156,
        scansToday: 12,
        qrQuota: 5,
        qrUsed: 3,
    }

    const recentQRCodes = [
        { id: '1', name: 'Website Link', scans: 89, createdAt: '2024-02-08' },
        { id: '2', name: 'Contact Card', scans: 45, createdAt: '2024-02-07' },
        { id: '3', name: 'WiFi Access', scans: 22, createdAt: '2024-02-06' },
    ]

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Welcome back! Here&apos;s an overview of your QR codes.
                    </p>
                </div>
                <Link href="/qr-codes/new">
                    <Button variant="gradient">
                        <Plus className="mr-2 h-4 w-4" />
                        Create QR Code
                    </Button>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total QR Codes</CardTitle>
                        <QrCode className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalQRCodes}</div>
                        <p className="text-xs text-muted-foreground">
                            {stats.qrUsed} of {stats.qrQuota} used (Free tier)
                        </p>
                    </CardContent>
                </Card>

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
                        <CardTitle className="text-sm font-medium">Scans Today</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.scansToday}</div>
                        <p className="text-xs text-muted-foreground">
                            +23% from yesterday
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">4.2%</div>
                        <p className="text-xs text-muted-foreground">
                            +0.5% from last week
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Upgrade Banner for Free Users */}
            <Card className="border-primary/50 bg-gradient-to-r from-purple-500/10 via-pink-500/5 to-orange-500/10">
                <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
                    <div>
                        <h3 className="font-semibold text-lg">Upgrade to Pro</h3>
                        <p className="text-muted-foreground text-sm">
                            Get unlimited QR codes, advanced analytics, and more.
                        </p>
                    </div>
                    <Link href="/billing">
                        <Button variant="gradient">
                            Upgrade Now
                        </Button>
                    </Link>
                </CardContent>
            </Card>

            {/* Recent QR Codes */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Recent QR Codes</CardTitle>
                            <CardDescription>Your latest created QR codes</CardDescription>
                        </div>
                        <Link href="/qr-codes">
                            <Button variant="outline" size="sm">View All</Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {recentQRCodes.map((qr) => (
                            <div
                                key={qr.id}
                                className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center">
                                        <QrCode className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{qr.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Created {qr.createdAt}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">{qr.scans}</p>
                                    <p className="text-sm text-muted-foreground">scans</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
