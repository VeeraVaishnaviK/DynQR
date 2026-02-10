'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Switch } from '@/components/ui/switch'

type QRCodeData = {
    id: string
    name: string
    destination_url: string
    is_active: boolean
    color_fg: string
    color_bg: string
}

export default function EditQRCodePage() {
    const params = useParams()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState<QRCodeData>({
        id: '',
        name: '',
        destination_url: '',
        is_active: true,
        color_fg: '#000000',
        color_bg: '#FFFFFF'
    })

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
                .select('id, name, destination_url, is_active, color_fg, color_bg')
                .eq('id', params.id)
                .eq('user_id', user.id)
                .single()

            if (error || !data) {
                toast.error('QR code not found')
                router.push('/qr-codes')
                return
            }

            setFormData(data)
        } catch (error) {
            console.error('Error:', error)
            toast.error('Failed to load QR code')
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            const supabase = createClient()
            const { error } = await supabase
                .from('qr_codes')
                .update({
                    name: formData.name,
                    destination_url: formData.destination_url,
                    is_active: formData.is_active,
                    color_fg: formData.color_fg,
                    color_bg: formData.color_bg,
                })
                .eq('id', params.id)

            if (error) {
                console.error('Update error:', error)
                toast.error('Failed to update QR code')
            } else {
                toast.success('QR code updated successfully!')
                router.push(`/qr-codes/${params.id}`)
            }
        } catch (error) {
            console.error('Unexpected error:', error)
            toast.error('An unexpected error occurred')
        } finally {
            setSaving(false)
        }
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
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href={`/qr-codes/${params.id}`}>
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">Edit QR Code</h1>
                    <p className="text-muted-foreground">Update your QR code settings</p>
                </div>
            </div>

            <form onSubmit={handleSave}>
                <div className="grid gap-6 max-w-2xl">
                    {/* Basic Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                            <CardDescription>Update the name and destination</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">QR Code Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="My QR Code"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="destination">Destination URL</Label>
                                <Input
                                    id="destination"
                                    type="url"
                                    value={formData.destination_url}
                                    onChange={(e) => setFormData({ ...formData, destination_url: e.target.value })}
                                    placeholder="https://example.com"
                                    required
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Customization */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Customization</CardTitle>
                            <CardDescription>Customize colors for your QR code</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="colorFg">Foreground Color</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="colorFg"
                                            type="color"
                                            value={formData.color_fg}
                                            onChange={(e) => setFormData({ ...formData, color_fg: e.target.value })}
                                            className="h-10 w-20"
                                        />
                                        <Input
                                            type="text"
                                            value={formData.color_fg}
                                            onChange={(e) => setFormData({ ...formData, color_fg: e.target.value })}
                                            className="flex-1 font-mono"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="colorBg">Background Color</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="colorBg"
                                            type="color"
                                            value={formData.color_bg}
                                            onChange={(e) => setFormData({ ...formData, color_bg: e.target.value })}
                                            className="h-10 w-20"
                                        />
                                        <Input
                                            type="text"
                                            value={formData.color_bg}
                                            onChange={(e) => setFormData({ ...formData, color_bg: e.target.value })}
                                            className="flex-1 font-mono"
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Status</CardTitle>
                            <CardDescription>Control whether this QR code is active</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Active Status</p>
                                    <p className="text-sm text-muted-foreground">
                                        {formData.is_active ? 'QR code is active and can be scanned' : 'QR code is inactive'}
                                    </p>
                                </div>
                                <Switch
                                    checked={formData.is_active}
                                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex gap-2">
                        <Button type="submit" variant="gradient" disabled={saving} className="flex-1">
                            {saving ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                        <Link href={`/qr-codes/${params.id}`}>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    )
}
