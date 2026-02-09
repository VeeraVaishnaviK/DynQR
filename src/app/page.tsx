import Link from 'next/link'
import { ArrowRight, QrCode, BarChart3, Zap, Shield, Palette, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const features = [
    {
        icon: QrCode,
        title: 'Dynamic QR Codes',
        description: 'Change destination URLs anytime without reprinting your QR codes.',
    },
    {
        icon: BarChart3,
        title: 'Powerful Analytics',
        description: 'Track scans, locations, devices, and more with detailed insights.',
    },
    {
        icon: Zap,
        title: 'Instant Generation',
        description: 'Create professional QR codes in seconds with our blazing-fast engine.',
    },
    {
        icon: Palette,
        title: 'Full Customization',
        description: 'Custom colors, logos, styles, and patterns to match your brand.',
    },
    {
        icon: Download,
        title: 'Multiple Formats',
        description: 'Download in PNG, SVG, PDF, and more for any use case.',
    },
    {
        icon: Shield,
        title: 'Secure & Reliable',
        description: '99.9% uptime with enterprise-grade security for your links.',
    },
]

const stats = [
    { value: '10M+', label: 'QR Codes Generated' },
    { value: '50M+', label: 'Scans Tracked' },
    { value: '99.9%', label: 'Uptime' },
    { value: '180+', label: 'Countries Served' },
]

export default function HomePage() {
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
                <section className="relative overflow-hidden py-20 md:py-32">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-orange-500/10" />
                    <div className="container mx-auto px-4 relative">
                        <div className="max-w-4xl mx-auto text-center">
                            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 animate-fade-in">
                                Create <span className="gradient-text">Dynamic QR Codes</span> That Convert
                            </h1>
                            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up">
                                Generate, customize, and track QR codes with powerful analytics. Change destinations anytime without reprinting.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-slide-up">
                                <Link href="/signup">
                                    <Button size="xl" variant="gradient" className="w-full sm:w-auto">
                                        Start Free <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                                <Link href="/features">
                                    <Button size="xl" variant="outline" className="w-full sm:w-auto">
                                        See Features
                                    </Button>
                                </Link>
                            </div>

                            {/* Demo QR Preview */}
                            <div className="relative max-w-sm mx-auto">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-xl opacity-30 animate-pulse" />
                                <div className="relative bg-card border rounded-3xl p-8 shadow-2xl">
                                    <div className="aspect-square bg-white rounded-xl p-4 flex items-center justify-center">
                                        <QrCode className="w-full h-full text-foreground" strokeWidth={0.5} />
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-4">
                                        Scan to see DynQR in action
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-16 border-y bg-muted/50">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {stats.map((stat) => (
                                <div key={stat.label} className="text-center">
                                    <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20" id="features">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Everything You Need for <span className="gradient-text">QR Success</span>
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Powerful features to create, manage, and analyze your QR codes like never before.
                            </p>
                        </div>
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

                {/* Pricing Section */}
                <section className="py-20 bg-muted/30" id="pricing">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Simple, <span className="gradient-text">Transparent Pricing</span>
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Start free. Scale as you grow. No hidden fees.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {/* Free Plan */}
                            <Card className="relative">
                                <CardHeader>
                                    <CardTitle>Free</CardTitle>
                                    <CardDescription>Perfect for trying out</CardDescription>
                                    <div className="mt-4">
                                        <span className="text-4xl font-bold">₹0</span>
                                        <span className="text-muted-foreground">/forever</span>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3 text-sm">
                                        <li className="flex items-center gap-2">
                                            <span className="text-green-500">✓</span> 5 QR codes (lifetime)
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="text-green-500">✓</span> Basic customization
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="text-green-500">✓</span> Basic analytics
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="text-green-500">✓</span> PNG/SVG download
                                        </li>
                                    </ul>
                                    <Link href="/signup" className="block mt-6">
                                        <Button variant="outline" className="w-full">Get Started</Button>
                                    </Link>
                                </CardContent>
                            </Card>

                            {/* Pro Monthly */}
                            <Card className="relative border-primary shadow-lg scale-105">
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                                        Most Popular
                                    </span>
                                </div>
                                <CardHeader>
                                    <CardTitle>Pro Monthly</CardTitle>
                                    <CardDescription>For growing businesses</CardDescription>
                                    <div className="mt-4">
                                        <span className="text-4xl font-bold">₹299</span>
                                        <span className="text-muted-foreground">/month</span>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3 text-sm">
                                        <li className="flex items-center gap-2">
                                            <span className="text-green-500">✓</span> Unlimited QR codes
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="text-green-500">✓</span> Full customization
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="text-green-500">✓</span> Advanced analytics
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="text-green-500">✓</span> All download formats
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="text-green-500">✓</span> Priority support
                                        </li>
                                    </ul>
                                    <Link href="/signup?plan=monthly" className="block mt-6">
                                        <Button variant="gradient" className="w-full">Subscribe Now</Button>
                                    </Link>
                                </CardContent>
                            </Card>

                            {/* Pro Yearly */}
                            <Card className="relative">
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                                        Save ₹589
                                    </span>
                                </div>
                                <CardHeader>
                                    <CardTitle>Pro Yearly</CardTitle>
                                    <CardDescription>Best value for teams</CardDescription>
                                    <div className="mt-4">
                                        <span className="text-4xl font-bold">₹2,999</span>
                                        <span className="text-muted-foreground">/year</span>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3 text-sm">
                                        <li className="flex items-center gap-2">
                                            <span className="text-green-500">✓</span> Everything in Pro Monthly
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="text-green-500">✓</span> 2 months free
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="text-green-500">✓</span> Priority support
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <span className="text-green-500">✓</span> Early access to features
                                        </li>
                                    </ul>
                                    <Link href="/signup?plan=yearly" className="block mt-6">
                                        <Button variant="outline" className="w-full">Subscribe Yearly</Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Pay per QR */}
                        <div className="text-center mt-8">
                            <p className="text-muted-foreground">
                                Need just a few more QR codes? <span className="font-semibold text-foreground">Pay ₹5 per additional QR code</span>
                            </p>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20">
                    <div className="container mx-auto px-4">
                        <div className="max-w-3xl mx-auto text-center">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Ready to Create Your First <span className="gradient-text">Dynamic QR Code</span>?
                            </h2>
                            <p className="text-lg text-muted-foreground mb-8">
                                Join thousands of businesses using DynQR to power their QR campaigns.
                            </p>
                            <Link href="/signup">
                                <Button size="xl" variant="gradient">
                                    Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
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
