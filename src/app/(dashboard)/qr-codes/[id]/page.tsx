'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Download, Edit, Trash2, Loader2, ExternalLink, QrCode as QrCodeIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import QRCode from 'qrcode'

type QRCodeData = {
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
    error_correction: string
}

export default function QRCodeDetailPage() {
    const params = useParams()
    const router = useRouter()
    const [qrCode, setQrCode] = useState<QRCodeData | null>(null)
    const [loading, setLoading] = useState(true)
    const [qrDataUrl, setQrDataUrl] = useState<string>('')

    useEffect(() => {
        if (params.id) {
            fetchQRCode()
        }
    }, [params.id])

    const fetchQRCode = async () => {
        try {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                toast.error('Please sign in')
                router.push('/login')
                return
            }

            const { data, error } = await supabase
                .from('qr_codes')
                .select('*')
                .eq('id', params.id)
                .eq('user_id', user.id)
                .single()

            if (error || !data) {
                toast.error('QR code not found')
                router.push('/qr-codes')
                return
            }

            setQrCode(data)

            // Generate QR code image
            const qrUrl = await QRCode.toDataURL(data.destination_url, {
                width: 400,
                color: {
                    dark: data.color_fg,
                    light: data.color_bg
                },
                errorCorrectionLevel: data.error_correction as any
            })
            setQrDataUrl(qrUrl)
        } catch (error) {
            console.error('Error:', error)
            toast.error('Failed to load QR code')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this QR code?')) return

        try {
            const supabase = createClient()
            const { error } = await supabase
                .from('qr_codes')
                .delete()
                .eq('id', params.id)

            if (error) {
                toast.error('Failed to delete QR code')
            } else {
                toast.success('QR code deleted successfully')
                router.push('/qr-codes')
            }
        } catch (error) {
            toast.error('An unexpected error occurred')
        }
    }

    const handleDownloadPNG = () => {
        if (!qrDataUrl || !qrCode) return

        const link = document.createElement('a')
        link.download = `${qrCode.name}.png`
        link.href = qrDataUrl
        link.click()
        toast.success('PNG downloaded!')
    }

    const handleDownloadSVG = async () => {
        if (!qrCode) return

        try {
            const svgString = await QRCode.toString(qrCode.destination_url, {
                type: 'svg',
                width: 512,
                color: {
                    dark: qrCode.color_fg,
                    light: qrCode.color_bg
                },
                errorCorrectionLevel: qrCode.error_correction as any
            })

            const blob = new Blob([svgString], { type: 'image/svg+xml' })
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.download = `${qrCode.name}.svg`
            link.href = url
            link.click()
            URL.revokeObjectURL(url)
            toast.success('SVG downloaded!')
        } catch (error) {
            console.error('SVG download error:', error)
            toast.error('Failed to download SVG')
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!qrCode) return null

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/qr-codes">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">{qrCode.name}</h1>
                        <p className="text-muted-foreground">
                            Created {new Date(qrCode.created_at).toLocaleDateString()}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link href={`/qr-codes/${qrCode.id}/edit`}>
                        <Button variant="outline">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </Button>
                    </Link>
                    <Button variant="destructive" onClick={handleDelete}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* QR Code Preview */}
                <Card>
                    <CardHeader>
                        <CardTitle>QR Code</CardTitle>
                        <CardDescription>Scan this code to test the destination</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {qrDataUrl && (
                            <div className="flex justify-center p-8 bg-muted rounded-lg">
                                <img src={qrDataUrl} alt={qrCode.name} className="rounded-lg" />
                            </div>
                        )}
                        <div className="flex gap-2">
                            <Button onClick={handleDownloadPNG} variant="outline" className="flex-1">
                                <Download className="mr-2 h-4 w-4" />
                                PNG
                            </Button>
                            <Button onClick={handleDownloadSVG} variant="gradient" className="flex-1">
                                <Download className="mr-2 h-4 w-4" />
                                SVG
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Details */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Statistics</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Total Scans</span>
                                <span className="font-semibold">{qrCode.current_scans}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Status</span>
                                <span className={qrCode.is_active ? 'text-green-600' : 'text-muted-foreground'}>
                                    {qrCode.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                                <span className="text-muted-foreground">Type</span>
                                <span className="font-medium">{qrCode.qr_type}</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="text-muted-foreground">Short Code</span>
                                <span className="font-mono">{qrCode.short_code}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Destination</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                                <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <a
                                    href={qrCode.destination_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-primary hover:underline truncate"
                                >
                                    {qrCode.destination_url}
                                </a>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Customization</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Foreground Color</span>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="h-6 w-6 rounded border"
                                        style={{ backgroundColor: qrCode.color_fg }}
                                    />
                                    <span className="text-sm font-mono">{qrCode.color_fg}</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Background Color</span>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="h-6 w-6 rounded border"
                                        style={{ backgroundColor: qrCode.color_bg }}
                                    />
                                    <span className="text-sm font-mono">{qrCode.color_bg}</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Error Correction</span>
                                <span className="font-mono">{qrCode.error_correction}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
