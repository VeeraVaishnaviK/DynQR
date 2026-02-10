import Link from 'next/link'
import { Lock, IndianRupee } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface QRBlurProtectionProps {
    isLocked: boolean
    className?: string
    showUpgradeButton?: boolean
    showUnlockButton?: boolean
    qrId?: string
    onUnlock?: (qrId: string) => void
    children: React.ReactNode
}

export function QRBlurProtection({
    isLocked,
    className,
    showUpgradeButton = true,
    showUnlockButton = false,
    qrId,
    onUnlock,
    children
}: QRBlurProtectionProps) {
    if (!isLocked) {
        return <>{children}</>
    }

    const handleUnlock = () => {
        if (qrId && onUnlock) {
            onUnlock(qrId)
        }
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
                    {showUnlockButton ? 'Unlock this QR Code' : 'Upgrade to Unlock'}
                </h3>
                <p className="text-sm text-muted-foreground text-center mb-4 px-4 max-w-[280px]">
                    {showUnlockButton
                        ? 'Pay ₹5 to unlock just this QR code, or subscribe for unlimited access.'
                        : 'You\'ve reached your free QR code limit. Subscribe to unlock this QR code.'
                    }
                </p>

                {/* Action Buttons */}
                <div className="flex gap-2 flex-wrap justify-center">
                    {showUnlockButton && qrId && (
                        <Button
                            variant="default"
                            size="sm"
                            onClick={handleUnlock}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        >
                            <IndianRupee className="mr-1 h-4 w-4" />
                            Pay ₹5 to Unlock
                        </Button>
                    )}
                    {showUpgradeButton && (
                        <Link href="/pricing">
                            <Button variant={showUnlockButton ? "outline" : "gradient"} size="sm">
                                View All Plans
                            </Button>
                        </Link>
                    )}
                </div>

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
