'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, Mail, Bell, Shield, Trash2, Loader2, Upload, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

export default function SettingsPage() {
    const [loading, setLoading] = useState(false)
    const [fetchingProfile, setFetchingProfile] = useState(true)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
    const [uploadingAvatar, setUploadingAvatar] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Password change dialog state
    const [showPasswordDialog, setShowPasswordDialog] = useState(false)
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [changingPassword, setChangingPassword] = useState(false)

    const [notifications, setNotifications] = useState({
        email: true,
        scans: true,
        marketing: false,
    })

    // Fetch user profile on mount
    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        try {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                toast.error('Please sign in to view settings')
                setFetchingProfile(false)
                return
            }

            // Fetch profile from database
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            if (error) {
                console.error('Error fetching profile:', error)
                // Use auth email as fallback
                setEmail(user.email || '')
                setName(user.user_metadata?.name || '')
            } else if (profile) {
                setName(profile.name || '')
                setEmail(profile.email || '')
                setAvatarUrl(profile.avatar_url || null)
            }
        } catch (error) {
            console.error('Unexpected error:', error)
            toast.error('Failed to load profile')
        } finally {
            setFetchingProfile(false)
        }
    }

    const handleSaveProfile = async () => {
        setLoading(true)

        try {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                toast.error('You must be logged in')
                setLoading(false)
                return
            }

            // Update profile in database
            const { error } = await supabase
                .from('profiles')
                .update({
                    name,
                    email,
                })
                .eq('id', user.id)

            if (error) {
                console.error('Error updating profile:', error)
                toast.error('Failed to update profile: ' + error.message)
            } else {
                toast.success('Profile updated successfully!')
            }
        } catch (error) {
            console.error('Unexpected error:', error)
            toast.error('An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    const handleAvatarClick = () => {
        fileInputRef.current?.click()
    }

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file')
            return
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast.error('Image must be less than 2MB')
            return
        }

        setUploadingAvatar(true)

        try {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                toast.error('You must be logged in')
                return
            }

            // Generate unique filename
            const fileExt = file.name.split('.').pop()
            const fileName = `${user.id}-${Date.now()}.${fileExt}`

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, file, { upsert: true })

            if (uploadError) {
                console.error('Upload error:', uploadError)
                if (uploadError.message.includes('row-level security') || uploadError.message.includes('policy')) {
                    toast.error('Storage permissions error. Please check Supabase Storage RLS policies.')
                } else {
                    toast.error('Failed to upload avatar: ' + uploadError.message)
                }
                return
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName)

            // Update profile with avatar URL
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', user.id)

            if (updateError) {
                console.error('Update error:', updateError)
                toast.error('Failed to update profile')
                return
            }

            setAvatarUrl(publicUrl)
            toast.success('Avatar updated successfully!')
        } catch (error) {
            console.error('Unexpected error:', error)
            toast.error('An unexpected error occurred')
        } finally {
            setUploadingAvatar(false)
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    const handlePasswordChange = async () => {
        if (!newPassword || !confirmPassword) {
            toast.error('Please fill in all fields')
            return
        }

        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters')
            return
        }

        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        setChangingPassword(true)

        try {
            const supabase = createClient()
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            })

            if (error) {
                console.error('Password change error:', error)
                toast.error('Failed to change password: ' + error.message)
            } else {
                toast.success('Password changed successfully!')
                setShowPasswordDialog(false)
                setNewPassword('')
                setConfirmPassword('')
            }
        } catch (error) {
            console.error('Unexpected error:', error)
            toast.error('An unexpected error occurred')
        } finally {
            setChangingPassword(false)
        }
    }

    const handleEnable2FA = () => {
        toast.info('Two-factor authentication setup coming soon! This feature requires MFA configuration in Supabase.')
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
                    {fetchingProfile ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center gap-4">
                                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                                    {avatarUrl ? (
                                        <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                                    ) : (
                                        <User className="h-10 w-10 text-primary" />
                                    )}
                                </div>
                                <div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAvatarUpload}
                                        className="hidden"
                                    />
                                    <Button
                                        variant="outline"
                                        onClick={handleAvatarClick}
                                        disabled={uploadingAvatar}
                                    >
                                        {uploadingAvatar ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="mr-2 h-4 w-4" />
                                                Change Avatar
                                            </>
                                        )}
                                    </Button>
                                </div>
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
                        </>
                    )}
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
                                Click to update your password
                            </p>
                        </div>
                        <Button variant="outline" onClick={() => setShowPasswordDialog(true)}>Change Password</Button>
                    </div>
                    <div className="flex items-center justify-between py-2">
                        <div>
                            <p className="font-medium">Two-Factor Authentication</p>
                            <p className="text-sm text-muted-foreground">
                                Add an extra layer of security
                            </p>
                        </div>
                        <Button variant="outline" onClick={handleEnable2FA}>Enable</Button>
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

            {/* Password Change Dialog */}
            <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                        <DialogDescription>
                            Enter your new password below. Make sure it's at least 6 characters.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <div className="relative">
                                <Input
                                    id="new-password"
                                    type={showNewPassword ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm Password</Label>
                            <div className="relative">
                                <Input
                                    id="confirm-password"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handlePasswordChange} disabled={changingPassword}>
                            {changingPassword ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Changing...
                                </>
                            ) : (
                                'Change Password'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
