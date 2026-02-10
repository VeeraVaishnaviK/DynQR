'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Minus, Plus, ShoppingCart, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

type BuyQRDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
}

export function BuyQRDialog({ open, onOpenChange, onSuccess }: BuyQRDialogProps) {
    const [quantity, setQuantity] = useState(1)
    const [loading, setLoading] = useState(false)
    const pricePerQR = 5
    const totalPrice = quantity * pricePerQR

    const handlePurchase = async () => {
        setLoading(true)
        try {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                toast.error('Please sign in to purchase QR codes')
                setLoading(false)
                return
            }

            // Create purchase record
            const { data: purchase, error: purchaseError } = await supabase
                .from('qr_purchases')
                .insert({
                    user_id: user.id,
                    quantity,
                    amount_paid: totalPrice,
                    payment_status: 'pending'
                })
                .select()
                .single()

            if (purchaseError) {
                console.error('Purchase error full:', JSON.stringify(purchaseError, null, 2))
                toast.error(`Failed to create purchase record: ${purchaseError.message || 'Unknown error'}`)
                setLoading(false)
                return
            }

            // TODO: Integrate Razorpay payment gateway
            // For now, just show a message
            toast.info(`Payment gateway integration coming soon! You selected ${quantity} QR code${quantity > 1 ? 's' : ''} for ₹${totalPrice}`)

            // TEMPORARY: Auto-complete purchase for testing (remove when Razorpay is integrated)
            await completePurchase(purchase.id, quantity)

            if (onSuccess) onSuccess()
            onOpenChange(false)
        } catch (error) {
            console.error('Unexpected error:', error)
            toast.error('An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    // Helper function to complete purchase (will be called after payment success)
    const completePurchase = async (purchaseId: string, qty: number) => {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Update purchase status
        await supabase
            .from('qr_purchases')
            .update({ payment_status: 'completed' })
            .eq('id', purchaseId)

        // Increase user quota
        const { data: profile } = await supabase
            .from('profiles')
            .select('qr_quota')
            .eq('id', user.id)
            .single()

        if (profile) {
            await supabase
                .from('profiles')
                .update({ qr_quota: profile.qr_quota + qty })
                .eq('id', user.id)

            toast.success(`Successfully added ${qty} QR code${qty > 1 ? 's' : ''} to your account!`)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Buy QR Codes</DialogTitle>
                    <DialogDescription>
                        Purchase individual QR codes for ₹5 each. No subscription required!
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Quantity Selector */}
                    <div className="space-y-3">
                        <Label>Quantity</Label>
                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                disabled={quantity <= 1}
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                            <div className="flex-1 text-center">
                                <span className="text-3xl font-bold">{quantity}</span>
                                <p className="text-sm text-muted-foreground">QR code{quantity > 1 ? 's' : ''}</p>
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                                disabled={quantity >= 10}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground text-center">
                            Maximum 10 QR codes per purchase
                        </p>
                    </div>

                    {/* Price Summary */}
                    <div className="rounded-lg border p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Price per QR</span>
                            <span>₹{pricePerQR}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Quantity</span>
                            <span>× {quantity}</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-semibold">
                            <span>Total</span>
                            <span className="text-2xl text-primary">₹{totalPrice}</span>
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button variant="gradient" onClick={handlePurchase} disabled={loading} className="w-full sm:w-auto">
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                Buy Now
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
