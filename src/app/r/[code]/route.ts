import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service role for scan tracking (bypasses RLS)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(
    request: Request,
    { params }: { params: Promise<{ code: string }> }
) {
    const { code } = await params
    const userAgent = request.headers.get('user-agent') || ''
    const forwardedFor = request.headers.get('x-forwarded-for')
    const ip = forwardedFor?.split(',')[0]?.trim() || 'unknown'

    try {
        // Look up the QR code
        const { data: qrCode, error } = await supabaseAdmin
            .from('qr_codes')
            .select('*')
            .eq('short_code', code)
            .single()

        if (error || !qrCode) {
            // QR code not found - redirect to homepage with error
            return NextResponse.redirect(new URL('/?error=qr_not_found', request.url))
        }

        // Check if QR code is active
        if (!qrCode.is_active) {
            return NextResponse.redirect(new URL('/?error=qr_inactive', request.url))
        }

        // Check expiration
        if (qrCode.expires_at && new Date(qrCode.expires_at) < new Date()) {
            return NextResponse.redirect(new URL('/?error=qr_expired', request.url))
        }

        // Check max scans
        if (qrCode.max_scans && qrCode.current_scans >= qrCode.max_scans) {
            return NextResponse.redirect(new URL('/?error=qr_limit_reached', request.url))
        }

        // Parse device info from user agent
        const deviceType = parseDeviceType(userAgent)
        const os = parseOS(userAgent)
        const browser = parseBrowser(userAgent)

        // Create visitor fingerprint
        const visitorFingerprint = Buffer.from(`${ip}:${userAgent}`).toString('base64').slice(0, 32)

        // Record the scan
        await supabaseAdmin.from('qr_scans').insert({
            qr_code_id: qrCode.id,
            ip_address: ip,
            user_agent: userAgent,
            device_type: deviceType,
            os,
            browser,
            visitor_fingerprint: visitorFingerprint,
        })

        // Check for password protection (future feature)
        if (qrCode.password_hash) {
            // Redirect to password entry page
            return NextResponse.redirect(new URL(`/protected?code=${code}`, request.url))
        }

        // Redirect to destination
        return NextResponse.redirect(qrCode.destination_url)

    } catch (err) {
        console.error('Error processing QR redirect:', err)
        return NextResponse.redirect(new URL('/?error=server_error', request.url))
    }
}

function parseDeviceType(userAgent: string): 'mobile' | 'tablet' | 'desktop' {
    const ua = userAgent.toLowerCase()
    if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet'
    if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) return 'mobile'
    return 'desktop'
}

function parseOS(userAgent: string): string {
    const ua = userAgent.toLowerCase()
    if (ua.includes('iphone') || ua.includes('ipad')) return 'iOS'
    if (ua.includes('android')) return 'Android'
    if (ua.includes('windows')) return 'Windows'
    if (ua.includes('mac')) return 'macOS'
    if (ua.includes('linux')) return 'Linux'
    return 'Unknown'
}

function parseBrowser(userAgent: string): string {
    const ua = userAgent.toLowerCase()
    if (ua.includes('chrome') && !ua.includes('edg')) return 'Chrome'
    if (ua.includes('safari') && !ua.includes('chrome')) return 'Safari'
    if (ua.includes('firefox')) return 'Firefox'
    if (ua.includes('edg')) return 'Edge'
    if (ua.includes('opera') || ua.includes('opr')) return 'Opera'
    return 'Unknown'
}
