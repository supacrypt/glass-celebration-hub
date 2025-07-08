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
    <div className="min-h-screen p-3 sm:p-6 pt-16 sm:pt-20 pb-20">
      <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
        <Card className="glass-card">
          <CardHeader className="pb-4 sm:pb-6">
            <CardTitle className="text-xl sm:text-2xl lg:wedding-heading font-semibold">Settings</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Customize your wedding app experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            {/* Notifications Section */}
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold">Notifications</h3>
              
              <div className="flex items-start sm:items-center justify-between gap-3">
                <div className="space-y-0.5 flex-1">
                  <Label htmlFor="email-notifications" className="text-sm sm:text-base">Email Notifications</Label>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Receive updates about the wedding via email
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                />
              </div>

              <div className="flex items-start sm:items-center justify-between gap-3">
                <div className="space-y-0.5 flex-1">
                  <Label htmlFor="push-notifications" className="text-sm sm:text-base">Push Notifications</Label>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Get instant notifications on your device
                  </p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                />
              </div>

              <div className="flex items-start sm:items-center justify-between gap-3">
                <div className="space-y-0.5 flex-1">
                  <Label htmlFor="weekly-digest" className="text-sm sm:text-base">Weekly Digest</Label>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
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
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold">Privacy</h3>
              
              <div className="flex items-start sm:items-center justify-between gap-3">
                <div className="space-y-0.5 flex-1">
                  <Label htmlFor="photo-auto-approval" className="text-sm sm:text-base">Photo Auto-Approval</Label>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
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
            <div className="space-y-3 sm:space-y-4">
              <h3 className="text-base sm:text-lg font-semibold">Appearance</h3>
              
              <div className="flex items-start sm:items-center justify-between gap-3">
                <div className="space-y-0.5 flex-1">
                  <Label htmlFor="dark-mode" className="text-sm sm:text-base">Dark Mode</Label>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Switch to a darker theme
                  </p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={settings.darkMode}
                  onCheckedChange={(checked) => handleSettingChange('darkMode', checked)}
                />
              </div>

              <div className="flex items-start sm:items-center justify-between gap-3">
                <div className="space-y-0.5 flex-1">
                  <Label htmlFor="sound-effects" className="text-sm sm:text-base">Sound Effects</Label>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
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
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button onClick={handleSave} className="glass-button min-h-[44px] text-sm sm:text-base">
                Save Settings
              </Button>
              <Button onClick={handleReset} variant="outline" className="min-h-[44px] text-sm sm:text-base">
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