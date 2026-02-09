import QRCode from 'qrcode'
import type { QRContent, QRCustomization, QRStyle, ErrorCorrectionLevel } from '@/types'

export interface GenerateQROptions {
    content: QRContent
    customization?: Partial<QRCustomization>
    size?: number
}

// Convert QR content to string format
export function contentToString(content: QRContent): string {
    switch (content.type) {
        case 'url':
            return content.url

        case 'email':
            let emailStr = `mailto:${content.email}`
            const emailParams: string[] = []
            if (content.subject) emailParams.push(`subject=${encodeURIComponent(content.subject)}`)
            if (content.body) emailParams.push(`body=${encodeURIComponent(content.body)}`)
            if (emailParams.length) emailStr += `?${emailParams.join('&')}`
            return emailStr

        case 'phone':
            return `tel:${content.phone}`

        case 'sms':
            let smsStr = `sms:${content.phone}`
            if (content.message) smsStr += `?body=${encodeURIComponent(content.message)}`
            return smsStr

        case 'wifi':
            const hidden = content.hidden ? 'H:true;' : ''
            const pass = content.password ? `P:${content.password};` : ''
            return `WIFI:T:${content.encryption};S:${content.ssid};${pass}${hidden};`

        case 'vcard':
            const vcard = [
                'BEGIN:VCARD',
                'VERSION:3.0',
                `N:${content.lastName || ''};${content.firstName}`,
                `FN:${content.firstName}${content.lastName ? ' ' + content.lastName : ''}`,
            ]
            if (content.email) vcard.push(`EMAIL:${content.email}`)
            if (content.phone) vcard.push(`TEL:${content.phone}`)
            if (content.company) vcard.push(`ORG:${content.company}`)
            if (content.title) vcard.push(`TITLE:${content.title}`)
            if (content.website) vcard.push(`URL:${content.website}`)
            if (content.address) vcard.push(`ADR:;;${content.address}`)
            vcard.push('END:VCARD')
            return vcard.join('\n')

        case 'text':
            return content.text

        default:
            return ''
    }
}

// Generate QR code as data URL
export async function generateQRDataURL(options: GenerateQROptions): Promise<string> {
    const { content, customization = {}, size = 512 } = options

    const dataString = contentToString(content)

    return QRCode.toDataURL(dataString, {
        width: size,
        margin: 2,
        color: {
            dark: customization.colorFg || '#000000',
            light: customization.colorBg || '#FFFFFF',
        },
        errorCorrectionLevel: customization.errorCorrection || 'M',
    })
}

// Generate QR code as SVG string
export async function generateQRSVG(options: GenerateQROptions): Promise<string> {
    const { content, customization = {} } = options

    const dataString = contentToString(content)

    return QRCode.toString(dataString, {
        type: 'svg',
        margin: 2,
        color: {
            dark: customization.colorFg || '#000000',
            light: customization.colorBg || '#FFFFFF',
        },
        errorCorrectionLevel: customization.errorCorrection || 'M',
    })
}

// Generate QR code as PNG buffer (for server-side)
export async function generateQRBuffer(options: GenerateQROptions): Promise<Buffer> {
    const { content, customization = {}, size = 512 } = options

    const dataString = contentToString(content)

    return QRCode.toBuffer(dataString, {
        width: size,
        margin: 2,
        color: {
            dark: customization.colorFg || '#000000',
            light: customization.colorBg || '#FFFFFF',
        },
        errorCorrectionLevel: customization.errorCorrection || 'M',
    })
}

// Validate URL
export function isValidUrl(url: string): boolean {
    try {
        new URL(url)
        return true
    } catch {
        return false
    }
}

// Validate email
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

// Validate phone
export function isValidPhone(phone: string): boolean {
    const phoneRegex = /^[+]?[\d\s\-()]+$/
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10
}

// QR Type display names
export const QR_TYPE_LABELS: Record<string, string> = {
    url: 'Website URL',
    email: 'Email',
    phone: 'Phone Number',
    sms: 'SMS Message',
    wifi: 'WiFi Network',
    vcard: 'Digital Business Card',
    text: 'Plain Text',
    app_store: 'App Store Links',
}

// QR Style options
export const QR_STYLES: { value: QRStyle; label: string }[] = [
    { value: 'classic', label: 'Classic' },
    { value: 'rounded', label: 'Rounded' },
    { value: 'dots', label: 'Dots' },
    { value: 'classy', label: 'Classy' },
]

// Error correction levels
export const ERROR_CORRECTION_LEVELS: { value: ErrorCorrectionLevel; label: string; description: string }[] = [
    { value: 'L', label: 'Low (7%)', description: 'Best for clean environments' },
    { value: 'M', label: 'Medium (15%)', description: 'Standard choice' },
    { value: 'Q', label: 'Quartile (25%)', description: 'Good for logos' },
    { value: 'H', label: 'High (30%)', description: 'Best for damaged codes' },
]
