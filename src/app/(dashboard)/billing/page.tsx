'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, CreditCard, Receipt, Download, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PRICING_PLANS } from '@/types'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type UserBillingData = {
    currentPlan: string
    qrUsed: number
    qrQuota: number
}

export default function BillingPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState<string | null>(null)
    const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly')
    const [billingData, setBillingData] = useState<UserBillingData>({
        currentPlan: 'free',
        qrUsed: 0,
        qrQuota: 5
    })

    useEffect(() => {
        fetchBillingData()
    }, [])

    const fetchBillingData = async () => {
        try {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                toast.error('Please sign in')
                router.push('/login')
                return
            }

            const { data: profile, error } = await supabase
                .from('profiles')
                .select('qr_quota, qr_used')
                .eq('id', user.id)
                .single()

            if (error) {
                console.error('Error fetching profile:', error)
            } else if (profile) {
                setBillingData({
                    currentPlan: 'free', // TODO: Add plan_type column to profiles table
                    qrUsed: profile.qr_used || 0,
                    qrQuota: profile.qr_quota || 5
                })
            }
        } catch (error) {
            console.error('Unexpected error:', error)
            toast.error('Failed to load billing information')
        } finally {
            setLoading(false)
        }
    }

    const handleSubscribe = async (plan: string) => {
        setActionLoading(plan)
        // Simulate Razorpay integration
        await new Promise(resolve => setTimeout(resolve, 2000))
        toast.info('Razorpay integration coming soon! This is a demo.')
        setActionLoading(null)
    }

    const handleBuyQR = async () => {
        setActionLoading('pay-per-qr')
        await new Promise(resolve => setTimeout(resolve, 1500))
        toast.info('Pay-per-QR feature coming soon!')
        setActionLoading(null)
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
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold">Billing</h1>
                <p className="text-muted-foreground">
                    Manage your subscription and payment methods
                </p>
            </div>

            {/* Current Plan */}
            <Card>
                <CardHeader>
                    <CardTitle>Current Plan</CardTitle>
                    <CardDescription>You are currently on the Free plan</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h3 className="text-2xl font-bold">{PRICING_PLANS.free.name}</h3>
                            <p className="text-muted-foreground">
                                {billingData.qrUsed} of {billingData.qrQuota} QR codes used
                            </p>
                            <div className="w-full max-w-xs h-2 bg-muted rounded-full mt-2">
                                <div
                                    className="h-full bg-primary rounded-full transition-all"
                                    style={{ width: `${(billingData.qrUsed / billingData.qrQuota) * 100}%` }}
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={handleBuyQR} disabled={actionLoading === 'pay-per-qr'}>
                                {actionLoading === 'pay-per-qr' ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : null}
                                Buy More QR Codes (₹5/each)
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Pricing Plans */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Upgrade Your Plan</h2>

                {/* Plan Toggle */}
                <div className="flex items-center justify-center gap-4 mb-6">
                    <span className={cn(
                        'text-sm font-medium transition-colors',
                        selectedPlan === 'monthly' ? 'text-foreground' : 'text-muted-foreground'
                    )}>
                        Monthly
                    </span>
                    <button
                        onClick={() => setSelectedPlan(selectedPlan === 'monthly' ? 'yearly' : 'monthly')}
                        className={cn(
                            'relative h-6 w-11 rounded-full transition-colors',
                            selectedPlan === 'yearly' ? 'bg-primary' : 'bg-muted'
                        )}
                    >
                        <span
                            className={cn(
                                'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
                                selectedPlan === 'yearly' ? 'translate-x-5 left-0.5' : 'translate-x-0.5 left-0'
                            )}
                        />
                    </button>
                    <span className={cn(
                        'text-sm font-medium transition-colors',
                        selectedPlan === 'yearly' ? 'text-foreground' : 'text-muted-foreground'
                    )}>
                        Yearly <span className="text-green-600">(Save ₹589)</span>
                    </span>
                </div>

                <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                    {/* Pro Monthly */}
                    <Card className={cn(
                        'relative transition-all',
                        selectedPlan === 'monthly' && 'border-primary shadow-lg'
                    )}>
                        {selectedPlan === 'monthly' && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                                    Selected
                                </span>
                            </div>
                        )}
                        <CardHeader>
                            <CardTitle>{PRICING_PLANS.monthly.name}</CardTitle>
                            <CardDescription>Perfect for growing businesses</CardDescription>
                            <div className="mt-4">
                                <span className="text-4xl font-bold">₹{PRICING_PLANS.monthly.price}</span>
                                <span className="text-muted-foreground">/month</span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3 text-sm mb-6">
                                {PRICING_PLANS.monthly.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-green-500" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <Button
                                variant={selectedPlan === 'monthly' ? 'gradient' : 'outline'}
                                className="w-full"
                                onClick={() => handleSubscribe('monthly')}
                                disabled={actionLoading === 'monthly'}
                            >
                                {actionLoading === 'monthly' ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    'Subscribe Monthly'
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Pro Yearly */}
                    <Card className={cn(
                        'relative transition-all',
                        selectedPlan === 'yearly' && 'border-primary shadow-lg'
                    )}>
                        {selectedPlan === 'yearly' && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                    Best Value
                                </span>
                            </div>
                        )}
                        <CardHeader>
                            <CardTitle>{PRICING_PLANS.yearly.name}</CardTitle>
                            <CardDescription>2 months free!</CardDescription>
                            <div className="mt-4">
                                <span className="text-4xl font-bold">₹{PRICING_PLANS.yearly.price}</span>
                                <span className="text-muted-foreground">/year</span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3 text-sm mb-6">
                                {PRICING_PLANS.yearly.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-green-500" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <Button
                                variant={selectedPlan === 'yearly' ? 'gradient' : 'outline'}
                                className="w-full"
                                onClick={() => handleSubscribe('yearly')}
                                disabled={actionLoading === 'yearly'}
                            >
                                {actionLoading === 'yearly' ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    'Subscribe Yearly'
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Payment Methods */}
            <Card>
                <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>Manage your payment information</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center">
                                <CreditCard className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="font-medium">No payment method</p>
                                <p className="text-sm text-muted-foreground">Add a payment method to subscribe</p>
                            </div>
                        </div>
                        <Button variant="outline">Add Method</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Billing History */}
            <Card>
                <CardHeader>
                    <CardTitle>Billing History</CardTitle>
                    <CardDescription>View and download your past invoices</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                        <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No billing history yet</p>
                        <p className="text-sm">Your invoices will appear here</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
