import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Moon, Sun, Globe, Lock, Shield, Trash2 } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    notifications: {
      push: true,
      email: true,
      sms: false,
      newPhotos: true,
      rsvpReminders: true,
      eventUpdates: true
    },
    privacy: {
      profileVisible: true,
      showInGuestList: true,
      allowPhotoTagging: true
    },
    preferences: {
      darkMode: false,
      language: 'en-AU',
      timezone: 'Australia/Sydney'
    }
  });

  const handleNotificationChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
    
    toast({
      title: "Settings Updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const handlePrivacyChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value
      }
    }));
    
    toast({
      title: "Privacy Updated",
      description: "Your privacy settings have been saved.",
    });
  };

  const handleDarkModeToggle = (value: boolean) => {
    setSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        darkMode: value
      }
    }));
    
    // Here you would implement actual dark mode toggle
    toast({
      title: "Theme Updated",
      description: `Switched to ${value ? 'dark' : 'light'} mode.`,
    });
  };

  const handleDeleteAccount = () => {
    // This would show a confirmation dialog in a real app
    toast({
      title: "Account Deletion",
      description: "Please contact support to delete your account.",
      variant: "destructive"
    });
  };

  return (
    <div className="min-h-screen px-5 pt-12 pb-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-wedding-navy" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-wedding-navy">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your app preferences</p>
        </div>
      </div>

      {/* Notifications */}
      <GlassCard className="p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-6 h-6 text-hsl(var(--glass-blue-tint))" />
          <h2 className="text-lg font-semibold text-wedding-navy">Notifications</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push-notifications" className="font-medium">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive push notifications on your device</p>
            </div>
            <Switch
              id="push-notifications"
              checked={settings.notifications.push}
              onCheckedChange={(value) => handleNotificationChange('push', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notifications" className="font-medium">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive updates via email</p>
            </div>
            <Switch
              id="email-notifications"
              checked={settings.notifications.email}
              onCheckedChange={(value) => handleNotificationChange('email', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="new-photos" className="font-medium">New Photos</Label>
              <p className="text-sm text-muted-foreground">Notify when new photos are shared</p>
            </div>
            <Switch
              id="new-photos"
              checked={settings.notifications.newPhotos}
              onCheckedChange={(value) => handleNotificationChange('newPhotos', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="rsvp-reminders" className="font-medium">RSVP Reminders</Label>
              <p className="text-sm text-muted-foreground">Get reminded about pending RSVPs</p>
            </div>
            <Switch
              id="rsvp-reminders"
              checked={settings.notifications.rsvpReminders}
              onCheckedChange={(value) => handleNotificationChange('rsvpReminders', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="event-updates" className="font-medium">Event Updates</Label>
              <p className="text-sm text-muted-foreground">Notify about event changes</p>
            </div>
            <Switch
              id="event-updates"
              checked={settings.notifications.eventUpdates}
              onCheckedChange={(value) => handleNotificationChange('eventUpdates', value)}
            />
          </div>
        </div>
      </GlassCard>

      {/* Privacy */}
      <GlassCard className="p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-6 h-6 text-hsl(var(--glass-green-tint))" />
          <h2 className="text-lg font-semibold text-wedding-navy">Privacy</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="profile-visible" className="font-medium">Profile Visibility</Label>
              <p className="text-sm text-muted-foreground">Allow others to see your profile</p>
            </div>
            <Switch
              id="profile-visible"
              checked={settings.privacy.profileVisible}
              onCheckedChange={(value) => handlePrivacyChange('profileVisible', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="guest-list" className="font-medium">Show in Guest List</Label>
              <p className="text-sm text-muted-foreground">Appear in the wedding guest directory</p>
            </div>
            <Switch
              id="guest-list"
              checked={settings.privacy.showInGuestList}
              onCheckedChange={(value) => handlePrivacyChange('showInGuestList', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="photo-tagging" className="font-medium">Photo Tagging</Label>
              <p className="text-sm text-muted-foreground">Allow others to tag you in photos</p>
            </div>
            <Switch
              id="photo-tagging"
              checked={settings.privacy.allowPhotoTagging}
              onCheckedChange={(value) => handlePrivacyChange('allowPhotoTagging', value)}
            />
          </div>
        </div>
      </GlassCard>

      {/* Appearance */}
      <GlassCard className="p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-6 h-6 text-hsl(var(--glass-purple-tint))" />
          <h2 className="text-lg font-semibold text-wedding-navy">Appearance</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {settings.preferences.darkMode ? (
                <Moon className="w-5 h-5 text-muted-foreground" />
              ) : (
                <Sun className="w-5 h-5 text-muted-foreground" />
              )}
              <div>
                <Label htmlFor="dark-mode" className="font-medium">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Use dark theme throughout the app</p>
              </div>
            </div>
            <Switch
              id="dark-mode"
              checked={settings.preferences.darkMode}
              onCheckedChange={handleDarkModeToggle}
            />
          </div>
        </div>
      </GlassCard>

      {/* Account Management */}
      <GlassCard className="p-6 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <Lock className="w-6 h-6 text-hsl(var(--glass-pink-tint))" />
          <h2 className="text-lg font-semibold text-wedding-navy">Account</h2>
        </div>

        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full justify-start gap-3"
            onClick={() => navigate('/profile')}
          >
            <Lock className="w-4 h-4" />
            Change Password
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start gap-3 text-red-600 border-red-200 hover:bg-red-50"
            onClick={handleDeleteAccount}
          >
            <Trash2 className="w-4 h-4" />
            Delete Account
          </Button>
        </div>
      </GlassCard>

      {/* App Info */}
      <GlassCard className="p-6">
        <h3 className="font-semibold text-wedding-navy mb-4">About</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex justify-between">
            <span>App Version</span>
            <span>1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span>Last Updated</span>
            <span>October 2024</span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default Settings;