'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    ArrowLeft,
    ArrowRight,
    Globe,
    Mail,
    Phone,
    MessageSquare,
    Wifi,
    User,
    Type,
    Download,
    Loader2,
    Check
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { generateQRDataURL, QR_TYPE_LABELS, ERROR_CORRECTION_LEVELS } from '@/lib/qr/generator'
import type { QRContent, QRType, QRStyle, ErrorCorrectionLevel } from '@/types'
import { toast } from 'sonner'

const QR_TYPES = [
    { type: 'url' as QRType, icon: Globe, label: 'Website URL', description: 'Link to any webpage' },
    { type: 'email' as QRType, icon: Mail, label: 'Email', description: 'Open email composer' },
    { type: 'phone' as QRType, icon: Phone, label: 'Phone', description: 'Make a phone call' },
    { type: 'sms' as QRType, icon: MessageSquare, label: 'SMS', description: 'Send a text message' },
    { type: 'wifi' as QRType, icon: Wifi, label: 'WiFi', description: 'Connect to WiFi network' },
    { type: 'vcard' as QRType, icon: User, label: 'vCard', description: 'Digital business card' },
    { type: 'text' as QRType, icon: Type, label: 'Plain Text', description: 'Display any text' },
]

const PRESET_COLORS = [
    '#000000', '#1F2937', '#7C3AED', '#2563EB', '#059669', '#DC2626', '#EA580C', '#CA8A04'
]

export default function NewQRCodePage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)

    // Step 1: QR Type
    const [qrType, setQrType] = useState<QRType>('url')

    // Step 2: Content
    const [name, setName] = useState('')
    const [url, setUrl] = useState('')
    const [email, setEmail] = useState('')
    const [emailSubject, setEmailSubject] = useState('')
    const [phone, setPhone] = useState('')
    const [smsMessage, setSmsMessage] = useState('')
    const [wifiSSID, setWifiSSID] = useState('')
    const [wifiPassword, setWifiPassword] = useState('')
    const [wifiEncryption, setWifiEncryption] = useState<'WPA' | 'WEP' | 'nopass'>('WPA')
    const [vcardFirstName, setVcardFirstName] = useState('')
    const [vcardLastName, setVcardLastName] = useState('')
    const [vcardEmail, setVcardEmail] = useState('')
    const [vcardPhone, setVcardPhone] = useState('')
    const [vcardCompany, setVcardCompany] = useState('')
    const [text, setText] = useState('')

    // Step 3: Customization
    const [colorFg, setColorFg] = useState('#000000')
    const [colorBg, setColorBg] = useState('#FFFFFF')
    const [errorCorrection, setErrorCorrection] = useState<ErrorCorrectionLevel>('M')

    // QR Preview
    const [qrDataUrl, setQrDataUrl] = useState('')

    // Generate QR preview
    useEffect(() => {
        const generatePreview = async () => {
            let content: QRContent

            switch (qrType) {
                case 'url':
                    if (!url) return
                    content = { type: 'url', url }
                    break
                case 'email':
                    if (!email) return
                    content = { type: 'email', email, subject: emailSubject }
                    break
                case 'phone':
                    if (!phone) return
                    content = { type: 'phone', phone }
                    break
                case 'sms':
                    if (!phone) return
                    content = { type: 'sms', phone, message: smsMessage }
                    break
                case 'wifi':
                    if (!wifiSSID) return
                    content = { type: 'wifi', ssid: wifiSSID, password: wifiPassword, encryption: wifiEncryption }
                    break
                case 'vcard':
                    if (!vcardFirstName) return
                    content = {
                        type: 'vcard',
                        firstName: vcardFirstName,
                        lastName: vcardLastName,
                        email: vcardEmail,
                        phone: vcardPhone,
                        company: vcardCompany
                    }
                    break
                case 'text':
                    if (!text) return
                    content = { type: 'text', text }
                    break
                default:
                    return
            }

            try {
                const dataUrl = await generateQRDataURL({
                    content,
                    customization: { colorFg, colorBg, errorCorrection },
                    size: 512,
                })
                setQrDataUrl(dataUrl)
            } catch (error) {
                console.error('Error generating QR:', error)
            }
        }

        generatePreview()
    }, [qrType, url, email, emailSubject, phone, smsMessage, wifiSSID, wifiPassword, wifiEncryption, vcardFirstName, vcardLastName, vcardEmail, vcardPhone, vcardCompany, text, colorFg, colorBg, errorCorrection])

    const handleNext = () => {
        if (step === 1) {
            setStep(2)
        } else if (step === 2) {
            // Validate content
            if (!name.trim()) {
                toast.error('Please enter a name for your QR code')
                return
            }
            setStep(3)
        }
    }

    const handleBack = () => {
        setStep(step - 1)
    }

    const handleCreate = async () => {
        setLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        toast.success('QR code created successfully!')
        router.push('/qr-codes')
    }

    const handleDownload = async (format: 'png' | 'svg') => {
        if (!qrDataUrl) return

        if (format === 'png') {
            const link = document.createElement('a')
            link.download = `${name || 'qrcode'}.png`
            link.href = qrDataUrl
            link.click()
            toast.success('QR code downloaded!')
        } else {
            toast.info('SVG download coming soon!')
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/qr-codes">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">Create QR Code</h1>
                    <p className="text-muted-foreground">
                        Step {step} of 3: {step === 1 ? 'Choose Type' : step === 2 ? 'Enter Content' : 'Customize'}
                    </p>
                </div>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-2">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex-1 flex items-center">
                        <div className={cn(
                            'h-2 flex-1 rounded-full transition-colors',
                            s <= step ? 'bg-primary' : 'bg-muted'
                        )} />
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Main Content */}
                <div>
                    {step === 1 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Choose QR Code Type</CardTitle>
                                <CardDescription>What kind of QR code do you want to create?</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-3">
                                    {QR_TYPES.map((type) => (
                                        <button
                                            key={type.type}
                                            onClick={() => setQrType(type.type)}
                                            className={cn(
                                                'flex items-center gap-4 p-4 rounded-lg border text-left transition-all',
                                                qrType === type.type
                                                    ? 'border-primary bg-primary/5'
                                                    : 'hover:bg-muted'
                                            )}
                                        >
                                            <div className={cn(
                                                'h-10 w-10 rounded-lg flex items-center justify-center',
                                                qrType === type.type ? 'bg-primary text-primary-foreground' : 'bg-muted'
                                            )}>
                                                <type.icon className="h-5 w-5" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium">{type.label}</p>
                                                <p className="text-sm text-muted-foreground">{type.description}</p>
                                            </div>
                                            {qrType === type.type && (
                                                <Check className="h-5 w-5 text-primary" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {step === 2 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Enter Content</CardTitle>
                                <CardDescription>Fill in the details for your {QR_TYPE_LABELS[qrType]}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">QR Code Name *</Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g., My Website QR"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>

                                {qrType === 'url' && (
                                    <div className="space-y-2">
                                        <Label htmlFor="url">Website URL *</Label>
                                        <Input
                                            id="url"
                                            type="url"
                                            placeholder="https://example.com"
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                        />
                                    </div>
                                )}

                                {qrType === 'email' && (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address *</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="hello@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="subject">Subject (optional)</Label>
                                            <Input
                                                id="subject"
                                                placeholder="Email subject"
                                                value={emailSubject}
                                                onChange={(e) => setEmailSubject(e.target.value)}
                                            />
                                        </div>
                                    </>
                                )}

                                {qrType === 'phone' && (
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number *</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            placeholder="+91 12345 67890"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                    </div>
                                )}

                                {qrType === 'sms' && (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Phone Number *</Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                placeholder="+91 12345 67890"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="message">Message (optional)</Label>
                                            <Input
                                                id="message"
                                                placeholder="Pre-filled message"
                                                value={smsMessage}
                                                onChange={(e) => setSmsMessage(e.target.value)}
                                            />
                                        </div>
                                    </>
                                )}

                                {qrType === 'wifi' && (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="ssid">Network Name (SSID) *</Label>
                                            <Input
                                                id="ssid"
                                                placeholder="MyWiFiNetwork"
                                                value={wifiSSID}
                                                onChange={(e) => setWifiSSID(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="password">Password</Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                placeholder="••••••••"
                                                value={wifiPassword}
                                                onChange={(e) => setWifiPassword(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Encryption</Label>
                                            <div className="flex gap-2">
                                                {(['WPA', 'WEP', 'nopass'] as const).map((enc) => (
                                                    <Button
                                                        key={enc}
                                                        type="button"
                                                        variant={wifiEncryption === enc ? 'secondary' : 'outline'}
                                                        size="sm"
                                                        onClick={() => setWifiEncryption(enc)}
                                                    >
                                                        {enc === 'nopass' ? 'None' : enc}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}

                                {qrType === 'vcard' && (
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">First Name *</Label>
                                            <Input
                                                id="firstName"
                                                placeholder="John"
                                                value={vcardFirstName}
                                                onChange={(e) => setVcardFirstName(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Last Name</Label>
                                            <Input
                                                id="lastName"
                                                placeholder="Doe"
                                                value={vcardLastName}
                                                onChange={(e) => setVcardLastName(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="vcardEmail">Email</Label>
                                            <Input
                                                id="vcardEmail"
                                                type="email"
                                                placeholder="john@example.com"
                                                value={vcardEmail}
                                                onChange={(e) => setVcardEmail(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="vcardPhone">Phone</Label>
                                            <Input
                                                id="vcardPhone"
                                                type="tel"
                                                placeholder="+91 12345 67890"
                                                value={vcardPhone}
                                                onChange={(e) => setVcardPhone(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2 sm:col-span-2">
                                            <Label htmlFor="company">Company</Label>
                                            <Input
                                                id="company"
                                                placeholder="Acme Inc."
                                                value={vcardCompany}
                                                onChange={(e) => setVcardCompany(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                )}

                                {qrType === 'text' && (
                                    <div className="space-y-2">
                                        <Label htmlFor="text">Text Content *</Label>
                                        <textarea
                                            id="text"
                                            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            placeholder="Enter your text here..."
                                            value={text}
                                            onChange={(e) => setText(e.target.value)}
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {step === 3 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Customize Appearance</CardTitle>
                                <CardDescription>Make your QR code match your brand</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-3">
                                    <Label>Foreground Color</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {PRESET_COLORS.map((color) => (
                                            <button
                                                key={color}
                                                onClick={() => setColorFg(color)}
                                                className={cn(
                                                    'h-8 w-8 rounded-full border-2 transition-transform hover:scale-110',
                                                    colorFg === color ? 'border-primary scale-110' : 'border-transparent'
                                                )}
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                        <Input
                                            type="color"
                                            value={colorFg}
                                            onChange={(e) => setColorFg(e.target.value)}
                                            className="h-8 w-8 p-0 border-0 cursor-pointer"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label>Background Color</Label>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => setColorBg('#FFFFFF')}
                                            className={cn(
                                                'h-8 w-8 rounded-full border-2 bg-white transition-transform hover:scale-110',
                                                colorBg === '#FFFFFF' ? 'border-primary scale-110' : 'border-gray-300'
                                            )}
                                        />
                                        <button
                                            onClick={() => setColorBg('#F3F4F6')}
                                            className={cn(
                                                'h-8 w-8 rounded-full border-2 transition-transform hover:scale-110',
                                                colorBg === '#F3F4F6' ? 'border-primary scale-110' : 'border-transparent'
                                            )}
                                            style={{ backgroundColor: '#F3F4F6' }}
                                        />
                                        <Input
                                            type="color"
                                            value={colorBg}
                                            onChange={(e) => setColorBg(e.target.value)}
                                            className="h-8 w-8 p-0 border-0 cursor-pointer"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label>Error Correction Level</Label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {ERROR_CORRECTION_LEVELS.map((level) => (
                                            <button
                                                key={level.value}
                                                onClick={() => setErrorCorrection(level.value)}
                                                className={cn(
                                                    'p-3 rounded-lg border text-left transition-all',
                                                    errorCorrection === level.value
                                                        ? 'border-primary bg-primary/5'
                                                        : 'hover:bg-muted'
                                                )}
                                            >
                                                <p className="font-medium text-sm">{level.label}</p>
                                                <p className="text-xs text-muted-foreground">{level.description}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Preview Panel */}
                <div className="lg:sticky lg:top-24 h-fit">
                    <Card>
                        <CardHeader>
                            <CardTitle>Preview</CardTitle>
                            <CardDescription>See how your QR code will look</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div
                                className="aspect-square rounded-lg flex items-center justify-center p-4"
                                style={{ backgroundColor: colorBg }}
                            >
                                {qrDataUrl ? (
                                    <img
                                        src={qrDataUrl}
                                        alt="QR Code Preview"
                                        className="w-full h-full object-contain"
                                    />
                                ) : (
                                    <div className="text-center text-muted-foreground">
                                        <p>Enter content to see preview</p>
                                    </div>
                                )}
                            </div>

                            {step === 3 && qrDataUrl && (
                                <div className="mt-4 flex gap-2">
                                    <Button
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => handleDownload('png')}
                                    >
                                        <Download className="mr-2 h-4 w-4" />
                                        PNG
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => handleDownload('svg')}
                                    >
                                        <Download className="mr-2 h-4 w-4" />
                                        SVG
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
                {step > 1 ? (
                    <Button variant="outline" onClick={handleBack}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                ) : (
                    <div />
                )}

                {step < 3 ? (
                    <Button variant="gradient" onClick={handleNext}>
                        Next
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                ) : (
                    <Button variant="gradient" onClick={handleCreate} disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                            </>
                        ) : (
                            'Create QR Code'
                        )}
                    </Button>
                )}
            </div>
        </div>
    )
}
