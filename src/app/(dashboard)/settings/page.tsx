'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, Mail, Bell, Shield, Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function SettingsPage() {
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState('John Doe')
    const [email, setEmail] = useState('john@example.com')
    const [notifications, setNotifications] = useState({
        email: true,
        scans: true,
        marketing: false,
    })

    const handleSaveProfile = async () => {
        setLoading(true)
        await new Promise(resolve => setTimeout(resolve, 1500))
        toast.success('Profile updated successfully!')
        setLoading(false)
    }

    const handleDeleteAccount = () => {
        toast.error('Account deletion is not available in demo mode')
    }

    return (
        <div className="space-y-6 max-w-3xl">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground">
                    Manage your account settings and preferences
                </p>
            </div>

            {/* Profile Settings */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-muted-foreground" />
                        <CardTitle>Profile</CardTitle>
                    </div>
                    <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-10 w-10 text-primary" />
                        </div>
                        <Button variant="outline">Change Avatar</Button>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>
                    <Button onClick={handleSaveProfile} disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            'Save Changes'
                        )}
                    </Button>
                </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-muted-foreground" />
                        <CardTitle>Notifications</CardTitle>
                    </div>
                    <CardDescription>Choose what notifications you receive</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Email Notifications</p>
                            <p className="text-sm text-muted-foreground">
                                Receive important updates via email
                            </p>
                        </div>
                        <button
                            onClick={() => setNotifications({ ...notifications, email: !notifications.email })}
                            className={`relative h-6 w-11 rounded-full transition-colors ${notifications.email ? 'bg-primary' : 'bg-muted'
                                }`}
                        >
                            <span
                                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${notifications.email ? 'translate-x-5 left-0.5' : 'translate-x-0.5 left-0'
                                    }`}
                            />
                        </button>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Scan Alerts</p>
                            <p className="text-sm text-muted-foreground">
                                Get notified when your QR codes are scanned
                            </p>
                        </div>
                        <button
                            onClick={() => setNotifications({ ...notifications, scans: !notifications.scans })}
                            className={`relative h-6 w-11 rounded-full transition-colors ${notifications.scans ? 'bg-primary' : 'bg-muted'
                                }`}
                        >
                            <span
                                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${notifications.scans ? 'translate-x-5 left-0.5' : 'translate-x-0.5 left-0'
                                    }`}
                            />
                        </button>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Marketing Emails</p>
                            <p className="text-sm text-muted-foreground">
                                Receive tips, updates, and offers
                            </p>
                        </div>
                        <button
                            onClick={() => setNotifications({ ...notifications, marketing: !notifications.marketing })}
                            className={`relative h-6 w-11 rounded-full transition-colors ${notifications.marketing ? 'bg-primary' : 'bg-muted'
                                }`}
                        >
                            <span
                                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${notifications.marketing ? 'translate-x-5 left-0.5' : 'translate-x-0.5 left-0'
                                    }`}
                            />
                        </button>
                    </div>
                </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-muted-foreground" />
                        <CardTitle>Security</CardTitle>
                    </div>
                    <CardDescription>Manage your account security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between py-2">
                        <div>
                            <p className="font-medium">Password</p>
                            <p className="text-sm text-muted-foreground">
                                Last changed 30 days ago
                            </p>
                        </div>
                        <Button variant="outline">Change Password</Button>
                    </div>
                    <div className="flex items-center justify-between py-2">
                        <div>
                            <p className="font-medium">Two-Factor Authentication</p>
                            <p className="text-sm text-muted-foreground">
                                Add an extra layer of security
                            </p>
                        </div>
                        <Button variant="outline">Enable</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive/50">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Trash2 className="h-5 w-5 text-destructive" />
                        <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    </div>
                    <CardDescription>Irreversible actions for your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">Delete Account</p>
                            <p className="text-sm text-muted-foreground">
                                Permanently delete your account and all data
                            </p>
                        </div>
                        <Button variant="destructive" onClick={handleDeleteAccount}>
                            Delete Account
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
