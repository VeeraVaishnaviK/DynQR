'use client'

import Link from 'next/link'
import { QrCode, BarChart3, Zap, Shield, Palette, Download, Globe, Clock, Lock, Smartphone, Users, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const features = [
    {
        icon: QrCode,
        title: 'Dynamic QR Codes',
        description: 'Update your QR code destination anytime without changing the printed code. Perfect for marketing campaigns that evolve.',
    },
    {
        icon: BarChart3,
        title: 'Advanced Analytics',
        description: 'Track every scan with detailed insights including location, device type, time, and more. Make data-driven decisions.',
    },
    {
        icon: Zap,
        title: 'Instant Generation',
        description: 'Create professional QR codes in seconds. No design skills needed - our engine handles everything.',
    },
    {
        icon: Palette,
        title: 'Full Customization',
        description: 'Match your brand with custom colors, shapes, and patterns. Add logos and choose from multiple styles.',
    },
    {
        icon: Download,
        title: 'Multiple Formats',
        description: 'Download your QR codes in PNG, SVG, or PDF. Get the right format for print or digital use.',
    },
    {
        icon: Shield,
        title: 'Enterprise Security',
        description: '99.9% uptime with enterprise-grade security. Your links are always safe and accessible.',
    },
    {
        icon: Globe,
        title: 'Global CDN',
        description: 'Lightning-fast redirects worldwide. Your QR codes work instantly no matter where they are scanned.',
    },
    {
        icon: Clock,
        title: 'Scheduled Links',
        description: 'Schedule when your QR code links become active or expire. Perfect for time-sensitive campaigns.',
    },
    {
        icon: Lock,
        title: 'Password Protection',
        description: 'Add password protection to your QR codes for exclusive content or private access.',
    },
    {
        icon: Smartphone,
        title: 'Mobile Optimized',
        description: 'All redirects are optimized for mobile devices with fast loading and responsive landing pages.',
    },
    {
        icon: Users,
        title: 'Team Collaboration',
        description: 'Work together with your team. Share QR codes, analytics, and manage permissions.',
    },
    {
        icon: RefreshCw,
        title: 'Bulk Operations',
        description: 'Create and manage hundreds of QR codes at once. Import from CSV and export analytics.',
    },
]

export default function FeaturesPage() {
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
                        <Link href="/features" className="text-sm font-medium text-foreground transition-colors">
                            Features
                        </Link>
                        <Link href="/pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
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
                                Powerful Features for <span className="gradient-text">QR Success</span>
                            </h1>
                            <p className="text-xl text-muted-foreground mb-8">
                                Everything you need to create, manage, and analyze QR codes that drive results.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {features.map((feature) => (
                                <Card key={feature.title} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                                    <CardHeader>
                                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                            <feature.icon className="h-6 w-6 text-primary" />
                                        </div>
                                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                                        <CardDescription className="text-base">{feature.description}</CardDescription>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-muted/30">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto text-center">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Ready to Get Started?
                            </h2>
                            <p className="text-lg text-muted-foreground mb-8">
                                Create your first dynamic QR code in seconds. No credit card required.
                            </p>
                            <Link href="/signup">
                                <Button size="lg" variant="gradient">
                                    Start Free Trial
                                </Button>
                            </Link>
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
