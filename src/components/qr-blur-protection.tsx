import Link from 'next/link'
import { Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface QRBlurProtectionProps {
    isLocked: boolean
    className?: string
    showUpgradeButton?: boolean
    children: React.ReactNode
}

export function QRBlurProtection({
    isLocked,
    className,
    showUpgradeButton = true,
    children
}: QRBlurProtectionProps) {
    if (!isLocked) {
        return <>{children}</>
    }

    return (
        <div className={cn('relative', className)}>
            {/* Blurred QR Code */}
            <div className="blur-[8px] select-none pointer-events-none" style={{ userSelect: 'none' }}>
                {children}
            </div>

            {/* Overlay */}
            <div
                className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm select-none"
                style={{ userSelect: 'none' }}
                onContextMenu={(e) => e.preventDefault()}
            >
                {/* Lock Icon */}
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Lock className="h-8 w-8 text-primary" />
                </div>

                {/* Watermark Text */}
                <h3 className="text-xl font-semibold mb-2 text-center px-4">
                    Upgrade to Unlock
                </h3>
                <p className="text-sm text-muted-foreground text-center mb-4 px-4 max-w-[280px]">
                    You've reached your free QR code limit. Subscribe to unlock this QR code.
                </p>

                {/* Upgrade Button */}
                {showUpgradeButton && (
                    <Link href="/pricing">
                        <Button variant="gradient" size="sm">
                            View Plans
                        </Button>
                    </Link>
                )}

                {/* Diagonal Watermark */}
                <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-10"
                    style={{
                        transform: 'rotate(-45deg)',
                        userSelect: 'none'
                    }}
                >
                    <p className="text-6xl font-bold whitespace-nowrap">
                        LOCKED
                    </p>
                </div>
            </div>
        </div>
    )
}
