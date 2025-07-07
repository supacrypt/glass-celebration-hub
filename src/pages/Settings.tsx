import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

const Settings: React.FC = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    photoAutoApproval: false,
    darkMode: false,
    soundEffects: true,
    weeklyDigest: true,
  });

  const handleSettingChange = (setting: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [setting]: value }));
  };

  const handleSave = () => {
    // In a real app, this would save to backend
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
      variant: "default",
    });
  };

  const handleReset = () => {
    setSettings({
      emailNotifications: true,
      pushNotifications: false,
      photoAutoApproval: false,
      darkMode: false,
      soundEffects: true,
      weeklyDigest: true,
    });
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to defaults.",
      variant: "default",
    });
  };

  return (
    <div className="min-h-screen p-6 pt-20">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="wedding-heading">Settings</CardTitle>
            <CardDescription>
              Customize your wedding app experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Notifications Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Notifications</h3>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive updates about the wedding via email
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get instant notifications on your device
                  </p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="weekly-digest">Weekly Digest</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive a weekly summary of activity
                  </p>
                </div>
                <Switch
                  id="weekly-digest"
                  checked={settings.weeklyDigest}
                  onCheckedChange={(checked) => handleSettingChange('weeklyDigest', checked)}
                />
              </div>
            </div>

            <Separator />

            {/* Privacy Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Privacy</h3>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="photo-auto-approval">Photo Auto-Approval</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically approve your uploaded photos
                  </p>
                </div>
                <Switch
                  id="photo-auto-approval"
                  checked={settings.photoAutoApproval}
                  onCheckedChange={(checked) => handleSettingChange('photoAutoApproval', checked)}
                />
              </div>
            </div>

            <Separator />

            {/* Appearance Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Appearance</h3>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Switch to a darker theme
                  </p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={settings.darkMode}
                  onCheckedChange={(checked) => handleSettingChange('darkMode', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sound-effects">Sound Effects</Label>
                  <p className="text-sm text-muted-foreground">
                    Play sounds for interactions
                  </p>
                </div>
                <Switch
                  id="sound-effects"
                  checked={settings.soundEffects}
                  onCheckedChange={(checked) => handleSettingChange('soundEffects', checked)}
                />
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button onClick={handleSave} className="glass-button">
                Save Settings
              </Button>
              <Button onClick={handleReset} variant="outline">
                Reset to Defaults
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;