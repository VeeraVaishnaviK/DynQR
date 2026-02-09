import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'sonner'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
})

export const metadata: Metadata = {
    title: 'DynQR - Dynamic QR Code Management',
    description: 'Create, manage, and track dynamic QR codes with powerful analytics. Perfect for businesses and individuals.',
    keywords: ['QR code', 'dynamic QR', 'QR generator', 'QR analytics', 'QR tracking'],
    authors: [{ name: 'DynQR' }],
    openGraph: {
        title: 'DynQR - Dynamic QR Code Management',
        description: 'Create, manage, and track dynamic QR codes with powerful analytics.',
        url: 'https://dynqr.app',
        siteName: 'DynQR',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'DynQR - Dynamic QR Code Management',
        description: 'Create, manage, and track dynamic QR codes with powerful analytics.',
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.variable} font-sans antialiased`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                    <Toaster richColors position="top-right" />
                </ThemeProvider>
            </body>
        </html>
    )
}
