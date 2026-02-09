'use client'

import Link from 'next/link'
import { QrCode, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const plans = [
    {
        name: 'Free',
        description: 'Perfect for trying out',
        price: '₹0',
        period: 'forever',
        features: [
            '5 QR codes (lifetime)',
            'Basic customization',
            'Basic analytics (7 days)',
            'PNG download',
            'Standard support',
        ],
        cta: 'Get Started',
        variant: 'outline' as const,
        popular: false,
    },
    {
        name: 'Pro Monthly',
        description: 'For growing businesses',
        price: '₹299',
        period: '/month',
        features: [
            'Unlimited QR codes',
            'Full customization',
            'Advanced analytics (forever)',
            'All download formats',
            'Priority support',
            'Custom domains',
            'Team collaboration',
            'API access',
        ],
        cta: 'Subscribe Now',
        variant: 'gradient' as const,
        popular: true,
    },
    {
        name: 'Pro Yearly',
        description: 'Best value - Save ₹589',
        price: '₹2,999',
        period: '/year',
        features: [
            'Everything in Pro Monthly',
            '2 months free',
            'Priority support',
            'Early access to features',
            'Dedicated account manager',
            'Custom integrations',
        ],
        cta: 'Subscribe Yearly',
        variant: 'outline' as const,
        popular: false,
    },
]

const faqs = [
    {
        question: 'Can I change my plan later?',
        answer: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.',
    },
    {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards, debit cards, UPI, and net banking through our secure payment partner Razorpay.',
    },
    {
        question: 'Is there a refund policy?',
        answer: 'Yes, we offer a 7-day money-back guarantee. If you are not satisfied, contact us for a full refund.',
    },
    {
        question: 'What happens to my QR codes if I cancel?',
        answer: 'Your QR codes will continue to work, but you will lose access to editing and analytics. Upgrade anytime to restore access.',
    },
]

export default function PricingPage() {
    return (
        <div className="flex min-h-screen flex-col">
            {/* Navigation */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <Link href="/" className="flex items-center gap-2">
                        <QrCode className="h-8 w-8 text-primary" />
                        <span className="text-xl font-bold gradient-text">DynQR</span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-6">
                        <Link href="/features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            Features
                        </Link>
                        <Link href="/pricing" className="text-sm font-medium text-foreground transition-colors">
                            Pricing
                        </Link>
                    </nav>
                    <div className="flex items-center gap-4">
                        <Link href="/login">
                            <Button variant="ghost">Login</Button>
                        </Link>
                        <Link href="/signup">
                            <Button variant="gradient">Get Started Free</Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative overflow-hidden py-20">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-orange-500/10" />
                    <div className="container mx-auto px-4 relative">
                        <div className="max-w-3xl mx-auto text-center">
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                                Simple, <span className="gradient-text">Transparent Pricing</span>
                            </h1>
                            <p className="text-xl text-muted-foreground mb-8">
                                Start free. Scale as you grow. No hidden fees.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Pricing Cards */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {plans.map((plan) => (
                                <Card
                                    key={plan.name}
                                    className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}
                                >
                                    {plan.popular && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                            <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                                                Most Popular
                                            </span>
                                        </div>
                                    )}
                                    <CardHeader>
                                        <CardTitle>{plan.name}</CardTitle>
                                        <CardDescription>{plan.description}</CardDescription>
                                        <div className="mt-4">
                                            <span className="text-4xl font-bold">{plan.price}</span>
                                            <span className="text-muted-foreground">{plan.period}</span>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-3 text-sm mb-6">
                                            {plan.features.map((feature) => (
                                                <li key={feature} className="flex items-center gap-2">
                                                    <Check className="h-4 w-4 text-green-500" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                        <Link href={`/signup?plan=${plan.name.toLowerCase().replace(' ', '-')}`}>
                                            <Button variant={plan.variant} className="w-full">
                                                {plan.cta}
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Pay per QR */}
                        <div className="text-center mt-8">
                            <p className="text-muted-foreground">
                                Need just a few more QR codes? <span className="font-semibold text-foreground">Pay ₹5 per additional QR code</span>
                            </p>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-16 bg-muted/30">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
                        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                            {faqs.map((faq) => (
                                <Card key={faq.question}>
                                    <CardHeader>
                                        <CardTitle className="text-lg">{faq.question}</CardTitle>
                                        <CardDescription className="text-base">{faq.answer}</CardDescription>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t py-12 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2">
                            <QrCode className="h-6 w-6 text-primary" />
                            <span className="font-bold">DynQR</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            © {new Date().getFullYear()} DynQR. All rights reserved.
                        </p>
                        <div className="flex gap-6">
                            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}
