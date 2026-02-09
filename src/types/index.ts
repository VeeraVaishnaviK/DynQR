// Database Types
export interface User {
    id: string
    email: string
    name: string | null
    avatar_url: string | null
    plan: 'free' | 'monthly' | 'yearly'
    qr_quota: number
    qr_used: number
    created_at: string
    updated_at: string
}

export interface QRCode {
    id: string
    user_id: string
    name: string
    short_code: string
    qr_type: QRType
    destination_url: string
    original_url: string | null

    // Customization
    color_fg: string
    color_bg: string
    logo_url: string | null
    style: QRStyle
    error_correction: ErrorCorrectionLevel

    // Features
    is_dynamic: boolean
    is_active: boolean
    password_hash: string | null
    expires_at: string | null
    max_scans: number | null
    current_scans: number

    // Organization
    folder_id: string | null
    tags: string[]

    created_at: string
    updated_at: string
    last_scanned_at: string | null
}

export interface QRScan {
    id: string
    qr_code_id: string
    scanned_at: string
    ip_address: string | null
    user_agent: string | null
    country: string | null
    city: string | null
    device_type: 'mobile' | 'desktop' | 'tablet' | null
    os: string | null
    browser: string | null
    referrer: string | null
    visitor_fingerprint: string | null
}

export interface Subscription {
    id: string
    user_id: string
    plan_type: 'monthly' | 'yearly' | 'pay-per-qr'
    status: 'active' | 'cancelled' | 'expired'
    amount: number
    currency: string
    payment_gateway: 'razorpay' | 'stripe'
    gateway_subscription_id: string | null
    current_period_start: string | null
    current_period_end: string | null
    created_at: string
}

// Enums
export type QRType =
    | 'url'
    | 'email'
    | 'phone'
    | 'sms'
    | 'wifi'
    | 'vcard'
    | 'text'
    | 'app_store'

export type QRStyle = 'classic' | 'rounded' | 'dots' | 'classy'

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H'

// QR Content Types
export interface QRContentURL {
    type: 'url'
    url: string
}

export interface QRContentEmail {
    type: 'email'
    email: string
    subject?: string
    body?: string
}

export interface QRContentPhone {
    type: 'phone'
    phone: string
}

export interface QRContentSMS {
    type: 'sms'
    phone: string
    message?: string
}

export interface QRContentWiFi {
    type: 'wifi'
    ssid: string
    password?: string
    encryption: 'WPA' | 'WEP' | 'nopass'
    hidden?: boolean
}

export interface QRContentVCard {
    type: 'vcard'
    firstName: string
    lastName?: string
    email?: string
    phone?: string
    company?: string
    title?: string
    website?: string
    address?: string
}

export interface QRContentText {
    type: 'text'
    text: string
}

export type QRContent =
    | QRContentURL
    | QRContentEmail
    | QRContentPhone
    | QRContentSMS
    | QRContentWiFi
    | QRContentVCard
    | QRContentText

// Customization Options
export interface QRCustomization {
    colorFg: string
    colorBg: string
    style: QRStyle
    errorCorrection: ErrorCorrectionLevel
    logoUrl?: string
}

// Analytics
export interface AnalyticsOverview {
    totalScans: number
    uniqueScans: number
    scansToday: number
    scansThisWeek: number
    scansThisMonth: number
    topQRCodes: { id: string; name: string; scans: number }[]
    scansByDevice: { device: string; count: number }[]
    scansByCountry: { country: string; count: number }[]
    scansOverTime: { date: string; scans: number }[]
}

// Pricing Plans
export const PRICING_PLANS = {
    free: {
        name: 'Free',
        price: 0,
        qrLimit: 5,
        features: [
            '5 QR codes (lifetime)',
            'Basic customization',
            'Basic analytics',
            'PNG/SVG download',
        ],
    },
    payPerQr: {
        name: 'Pay per QR',
        price: 5,
        currency: 'INR',
        features: [
            '₹5 per additional QR code',
            'Full customization',
            'Advanced analytics',
            'All download formats',
        ],
    },
    monthly: {
        name: 'Pro Monthly',
        price: 299,
        currency: 'INR',
        interval: 'month',
        features: [
            'Unlimited QR codes',
            'Full customization',
            'Advanced analytics',
            'All download formats',
            'Priority support',
        ],
    },
    yearly: {
        name: 'Pro Yearly',
        price: 2999,
        currency: 'INR',
        interval: 'year',
        features: [
            'Unlimited QR codes',
            'Full customization',
            'Advanced analytics',
            'All download formats',
            'Priority support',
            '2 months free!',
        ],
    },
} as const
