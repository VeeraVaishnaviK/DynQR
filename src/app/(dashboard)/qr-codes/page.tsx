'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { QrCode, Search, Grid, List, Plus, MoreHorizontal, Eye, Edit, Trash2, ExternalLink, Loader2, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { QRBlurProtection } from '@/components/qr-blur-protection'

type QRCode = {
    id: string
    name: string
    short_code: string
    destination_url: string
    qr_type: string
    current_scans: number
    is_active: boolean
    created_at: string
    color_fg: string
    color_bg: string
}

export default function QRCodesPage() {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedQR, setSelectedQR] = useState<string | null>(null)
    const [qrCodes, setQrCodes] = useState<QRCode[]>([])
    const [loading, setLoading] = useState(true)
    const [lockedQRIds, setLockedQRIds] = useState<Set<string>>(new Set())

    // Fetch QR codes from Supabase
    useEffect(() => {
        fetchQRCodes()
    }, [])

    const fetchQRCodes = async () => {
        try {
            const supabase = createClient()

            // Get authenticated user
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                toast.error('Please sign in to view your QR codes')
                setLoading(false)
                return
            }

            // Fetch user profile to check quota
            const { data: profile } = await supabase
                .from('profiles')
                .select('qr_quota, subscription_status')
                .eq('id', user.id)
                .single()

            // Fetch QR codes for the user
            const { data, error } = await supabase
                .from('qr_codes')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Error fetching QR codes:', error)
                toast.error('Failed to load QR codes')
                setQrCodes([])
            } else {
                setQrCodes(data || [])

                // Determine which QR codes are locked
                const isFreeUser = !profile || profile.subscription_status === 'free'
                const quota = profile?.qr_quota || 5

                if (isFreeUser && data && data.length > quota) {
                    // Sort by creation date ascending to get oldest first
                    const sortedQRs = [...data].sort((a, b) =>
                        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                    )

                    // QR codes beyond quota are locked
                    const locked = new Set(sortedQRs.slice(quota).map(qr => qr.id))
                    setLockedQRIds(locked)
                } else {
                    setLockedQRIds(new Set())
                }
            }
        } catch (error) {
            console.error('Unexpected error:', error)
            toast.error('An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this QR code?')) return

        try {
            const supabase = createClient()
            const { error } = await supabase
                .from('qr_codes')
                .delete()
                .eq('id', id)

            if (error) {
                toast.error('Failed to delete QR code')
            } else {
                toast.success('QR code deleted successfully')
                fetchQRCodes() // Refresh the list
            }
        } catch (error) {
            toast.error('An unexpected error occurred')
        }
    }

    const filteredQRCodes = qrCodes.filter(qr =>
        qr.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">QR Codes</h1>
                    <p className="text-muted-foreground">
                        Manage and track all your QR codes
                    </p>
                </div>
                <Link href="/qr-codes/new">
                    <Button variant="gradient">
                        <Plus className="mr-2 h-4 w-4" />
                        Create QR Code
                    </Button>
                </Link>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search QR codes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                        size="icon"
                        onClick={() => setViewMode('grid')}
                    >
                        <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                        size="icon"
                        onClick={() => setViewMode('list')}
                    >
                        <List className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* QR Codes Grid/List */}
            {loading ? (
                <Card className="py-16">
                    <CardContent className="flex flex-col items-center justify-center text-center">
                        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                        <p className="text-muted-foreground">Loading your QR codes...</p>
                    </CardContent>
                </Card>
            ) : filteredQRCodes.length === 0 ? (
                <Card className="py-16">
                    <CardContent className="flex flex-col items-center justify-center text-center">
                        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                            <QrCode className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">No QR codes found</h3>
                        <p className="text-muted-foreground mb-4">
                            {searchQuery ? 'Try a different search term' : 'Create your first QR code to get started'}
                        </p>
                        {!searchQuery && (
                            <Link href="/qr-codes/new">
                                <Button variant="gradient">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create QR Code
                                </Button>
                            </Link>
                        )}
                    </CardContent>
                </Card>
            ) : viewMode === 'grid' ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredQRCodes.map((qr) => (
                        <Card key={qr.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                            <CardContent className="p-4">
                                {/* QR Preview */}
                                <QRBlurProtection
                                    isLocked={lockedQRIds.has(qr.id)}
                                    showUpgradeButton={false}
                                    className="mb-4"
                                >
                                    <div
                                        className="aspect-square rounded-lg flex items-center justify-center relative overflow-hidden"
                                        style={{ backgroundColor: qr.color_bg }}
                                    >
                                        <QrCode
                                            className="w-3/4 h-3/4"
                                            style={{ color: qr.color_fg }}
                                            strokeWidth={0.5}
                                        />
                                        {!qr.is_active && (
                                            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                                                <span className="text-sm font-medium text-muted-foreground">Inactive</span>
                                            </div>
                                        )}
                                    </div>
                                </QRBlurProtection>

                                {/* QR Info */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold truncate">{qr.name}</h3>
                                        <div className="relative">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => setSelectedQR(selectedQR === qr.id ? null : qr.id)}
                                            >
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                            {selectedQR === qr.id && (
                                                <>
                                                    <div
                                                        className="fixed inset-0 z-40"
                                                        onClick={() => setSelectedQR(null)}
                                                    />
                                                    <div className="absolute right-0 mt-1 w-40 bg-card border rounded-lg shadow-lg py-1 z-50">
                                                        <Link
                                                            href={`/qr-codes/${qr.id}`}
                                                            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                            View Details
                                                        </Link>
                                                        <Link
                                                            href={`/qr-codes/${qr.id}/edit`}
                                                            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(qr.id)}
                                                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                            Delete
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                                        <span>{qr.current_scans} scans</span>
                                        <div className="flex gap-2">
                                            {lockedQRIds.has(qr.id) && (
                                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-orange-500/10 text-orange-600 flex items-center gap-1">
                                                    <Lock className="h-3 w-3" />
                                                    Locked
                                                </span>
                                            )}
                                            <span className={cn(
                                                'px-2 py-0.5 rounded-full text-xs font-medium',
                                                qr.is_active
                                                    ? 'bg-green-500/10 text-green-600'
                                                    : 'bg-muted text-muted-foreground'
                                            )}>
                                                {qr.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Created {new Date(qr.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="p-0">
                        <div className="divide-y">
                            {filteredQRCodes.map((qr) => (
                                <div
                                    key={qr.id}
                                    className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <QRBlurProtection
                                            isLocked={lockedQRIds.has(qr.id)}
                                            showUpgradeButton={false}
                                            className="h-12 w-12 flex-shrink-0"
                                        >
                                            <div
                                                className="h-12 w-12 rounded-lg flex items-center justify-center"
                                                style={{ backgroundColor: qr.color_bg }}
                                            >
                                                <QrCode
                                                    className="h-8 w-8"
                                                    style={{ color: qr.color_fg }}
                                                    strokeWidth={0.5}
                                                />
                                            </div>
                                        </QRBlurProtection>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium">{qr.name}</p>
                                                {lockedQRIds.has(qr.id) && (
                                                    <Lock className="h-3 w-3 text-orange-600" />
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {qr.qr_type} • Created {new Date(qr.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right hidden sm:block">
                                            <p className="font-semibold">{qr.current_scans}</p>
                                            <p className="text-sm text-muted-foreground">scans</p>
                                        </div>
                                        <span className={cn(
                                            'px-2 py-0.5 rounded-full text-xs font-medium hidden sm:inline-flex',
                                            qr.is_active
                                                ? 'bg-green-500/10 text-green-600'
                                                : 'bg-muted text-muted-foreground'
                                        )}>
                                            {qr.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <Link href={`/qr-codes/${qr.id}`}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Link href={`/qr-codes/${qr.id}/edit`}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                onClick={() => handleDelete(qr.id)}
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-destructive hover:text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
