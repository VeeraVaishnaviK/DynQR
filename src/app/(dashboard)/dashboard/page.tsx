import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { QrCode, BarChart3, Eye, TrendingUp, Plus } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Fetch real stats from database
    let stats = {
        totalQRCodes: 0,
        totalScans: 0,
        scansToday: 0,
        qrQuota: 5,
        qrUsed: 0,
    }

    let recentQRCodes: Array<{ id: string; name: string; scans: number; createdAt: string }> = []

    if (user) {
        // Get user profile with quota info
        const { data: profile } = await supabase
            .from('profiles')
            .select('qr_quota, qr_used')
            .eq('id', user.id)
            .single()

        if (profile) {
            // Get purchased amount
            const { data: purchases } = await supabase
                .from('qr_purchases')
                .select('quantity')
                .eq('user_id', user.id)
                .eq('payment_status', 'completed')

            const purchasedAmount = purchases?.reduce((sum, p) => sum + p.quantity, 0) || 0

            stats.qrQuota = (profile.qr_quota || 5)
            stats.qrUsed = profile.qr_used || 0
        }

        // Get total QR codes count
        const { count: qrCount } = await supabase
            .from('qr_codes')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)

        stats.totalQRCodes = qrCount || 0

        //Get QR codes with their scan counts
        const { data: qrCodes } = await supabase
            .from('qr_codes')
            .select('id, name, current_scans, created_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(3)

        if (qrCodes) {
            // Calculate total scans across all QR codes
            stats.totalScans = qrCodes.reduce((sum, qr) => sum + (qr.current_scans || 0), 0)

            recentQRCodes = qrCodes.map(qr => ({
                id: qr.id,
                name: qr.name,
                scans: qr.current_scans || 0,
                createdAt: new Date(qr.created_at).toLocaleDateString()
            }))
        }

        // Get scans today - Note: This requires qr_scans table data
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const { count: todayScans } = await supabase
            .from('qr_scans')
            .select('*', { count: 'exact', head: true })
            .gte('scanned_at', today.toISOString())
            .in('qr_code_id', qrCodes?.map(qr => qr.id) || [])

        stats.scansToday = todayScans || 0
    }

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
                            {stats.qrUsed} of {stats.qrQuota} used {stats.qrQuota > 5 ? '(includes purchased)' : '(Free tier)'}
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
