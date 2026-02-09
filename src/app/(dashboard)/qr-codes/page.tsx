'use client'

import { useState } from 'react'
import Link from 'next/link'
import { QrCode, Search, Grid, List, Plus, MoreHorizontal, Eye, Edit, Trash2, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

// Mock data for QR codes
const mockQRCodes = [
    {
        id: '1',
        name: 'Website Link',
        shortCode: 'abc123',
        destinationUrl: 'https://example.com',
        qrType: 'url',
        scans: 89,
        isActive: true,
        createdAt: '2024-02-08',
        colorFg: '#000000',
        colorBg: '#FFFFFF',
    },
    {
        id: '2',
        name: 'Contact Card',
        shortCode: 'def456',
        destinationUrl: 'vcard data',
        qrType: 'vcard',
        scans: 45,
        isActive: true,
        createdAt: '2024-02-07',
        colorFg: '#7C3AED',
        colorBg: '#FFFFFF',
    },
    {
        id: '3',
        name: 'WiFi Access',
        shortCode: 'ghi789',
        destinationUrl: 'wifi config',
        qrType: 'wifi',
        scans: 22,
        isActive: false,
        createdAt: '2024-02-06',
        colorFg: '#059669',
        colorBg: '#FFFFFF',
    },
]

export default function QRCodesPage() {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedQR, setSelectedQR] = useState<string | null>(null)

    const filteredQRCodes = mockQRCodes.filter(qr =>
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
            {filteredQRCodes.length === 0 ? (
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
                                <div
                                    className="aspect-square rounded-lg mb-4 flex items-center justify-center relative overflow-hidden"
                                    style={{ backgroundColor: qr.colorBg }}
                                >
                                    <QrCode
                                        className="w-3/4 h-3/4"
                                        style={{ color: qr.colorFg }}
                                        strokeWidth={0.5}
                                    />
                                    {!qr.isActive && (
                                        <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                                            <span className="text-sm font-medium text-muted-foreground">Inactive</span>
                                        </div>
                                    )}
                                </div>

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
                                                        <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10">
                                                            <Trash2 className="h-4 w-4" />
                                                            Delete
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                                        <span>{qr.scans} scans</span>
                                        <span className={cn(
                                            'px-2 py-0.5 rounded-full text-xs font-medium',
                                            qr.isActive
                                                ? 'bg-green-500/10 text-green-600'
                                                : 'bg-muted text-muted-foreground'
                                        )}>
                                            {qr.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Created {qr.createdAt}
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
                                        <div
                                            className="h-12 w-12 rounded-lg flex items-center justify-center"
                                            style={{ backgroundColor: qr.colorBg }}
                                        >
                                            <QrCode
                                                className="h-8 w-8"
                                                style={{ color: qr.colorFg }}
                                                strokeWidth={0.5}
                                            />
                                        </div>
                                        <div>
                                            <p className="font-medium">{qr.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {qr.qrType} • Created {qr.createdAt}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right hidden sm:block">
                                            <p className="font-semibold">{qr.scans}</p>
                                            <p className="text-sm text-muted-foreground">scans</p>
                                        </div>
                                        <span className={cn(
                                            'px-2 py-0.5 rounded-full text-xs font-medium hidden sm:inline-flex',
                                            qr.isActive
                                                ? 'bg-green-500/10 text-green-600'
                                                : 'bg-muted text-muted-foreground'
                                        )}>
                                            {qr.isActive ? 'Active' : 'Inactive'}
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
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
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
