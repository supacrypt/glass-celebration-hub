import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Settings, Map, Palette, Globe, Save } from 'lucide-react';

interface AppSetting {
  setting_key: string;
  setting_value: string | null;
}

const SettingsManager: React.FC = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const defaultSettings = {
    app_name: 'Tim & Kirsten\'s Wedding',
    app_description: 'Join us as we celebrate our love and commitment surrounded by family and friends',
    mapbox_access_token: 'pk.eyJ1Ijoic3VwYWJhc2VjcnlwdCIsImEiOiJjbWNzcG03N3kxNjFyMmlxMmQyb280cWhvIn0.VTVcx03Z6tAg5ZVzJoxjSA',
    mapbox_style_url: 'mapbox://styles/supabasecrypt/cmcspsqaf000p01sq2x73ewym',
    wedding_date: '2025-10-05',
    couple_names: 'Tim & Kirsten',
    enable_photo_moderation: 'true',
    enable_public_rsvp: 'true',
    enable_gift_registry: 'true',
    primary_color: '#2C3E50',
    secondary_color: '#F5F2ED',
    active_background: 'background 1.png',
  };

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('app_settings')
        .select('setting_key, setting_value');

      if (error) throw error;

      const settingsMap: Record<string, string> = {};
      data?.forEach((setting: AppSetting) => {
        settingsMap[setting.setting_key] = setting.setting_value || '';
      });

      // Merge with defaults for any missing settings
      const mergedSettings = { ...defaultSettings, ...settingsMap };
      setSettings(mergedSettings);
    } catch (error: any) {
      console.error('Error fetching settings:', error);
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive"
      });
      // Use defaults if fetch fails
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSetting = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSetting = async (key: string, value: string) => {
    try {
      const { error } = await supabase
        .from('app_settings')
        .upsert({
          setting_key: key,
          setting_value: value
        }, {
          onConflict: 'setting_key'
        });

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error('Error saving setting:', error);
      return false;
    }
  };

  const saveAllSettings = async () => {
    try {
      setSaving(true);
      let hasErrors = false;

      for (const [key, value] of Object.entries(settings)) {
        const success = await saveSetting(key, value);
        if (!success) hasErrors = true;
      }

      if (hasErrors) {
        toast({
          title: "Partial Success",
          description: "Some settings may not have been saved properly",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Settings Saved",
          description: "All application settings have been updated successfully",
        });
      }
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-navy"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-wedding-navy flex items-center gap-2">
            <Settings className="w-6 h-6" />
            Application Settings
          </h2>
          <p className="text-muted-foreground">Configure your wedding application settings</p>
        </div>
        <Button onClick={saveAllSettings} disabled={saving} className="glass-button">
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save All
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="mapbox">Mapbox</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                General Settings
              </CardTitle>
              <CardDescription>
                Basic application configuration and wedding details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="app_name">Application Name</Label>
                  <Input
                    id="app_name"
                    value={settings.app_name || ''}
                    onChange={(e) => updateSetting('app_name', e.target.value)}
                    placeholder="Tim & Kirsten's Wedding"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="couple_names">Couple Names</Label>
                  <Input
                    id="couple_names"
                    value={settings.couple_names || ''}
                    onChange={(e) => updateSetting('couple_names', e.target.value)}
                    placeholder="Tim & Kirsten"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="app_description">Application Description</Label>
                <Textarea
                  id="app_description"
                  value={settings.app_description || ''}
                  onChange={(e) => updateSetting('app_description', e.target.value)}
                  placeholder="Join us as we celebrate our love and commitment surrounded by family and friends"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="wedding_date">Wedding Date</Label>
                <Input
                  id="wedding_date"
                  type="date"
                  value={settings.wedding_date || ''}
                  onChange={(e) => updateSetting('wedding_date', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mapbox" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="w-5 h-5" />
                Mapbox Configuration
              </CardTitle>
              <CardDescription>
                Configure Mapbox integration for venue maps
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mapbox_access_token">Access Token</Label>
                <Input
                  id="mapbox_access_token"
                  value={settings.mapbox_access_token || ''}
                  onChange={(e) => updateSetting('mapbox_access_token', e.target.value)}
                  placeholder="pk.eyJ1..."
                  type="password"
                />
                <p className="text-xs text-muted-foreground">
                  Your Mapbox public access token
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mapbox_style_url">Style URL</Label>
                <Input
                  id="mapbox_style_url"
                  value={settings.mapbox_style_url || ''}
                  onChange={(e) => updateSetting('mapbox_style_url', e.target.value)}
                  placeholder="mapbox://styles/username/style-id"
                />
                <p className="text-xs text-muted-foreground">
                  Custom Mapbox style URL for venue maps
                </p>
              </div>

              <div className="p-4 bg-muted/20 rounded-lg">
                <h4 className="font-medium mb-2">Current Configuration</h4>
                <div className="text-sm space-y-1">
                  <div><strong>Token:</strong> {settings.mapbox_access_token ? '••••••••••••' + settings.mapbox_access_token.slice(-8) : 'Not set'}</div>
                  <div><strong>Style:</strong> {settings.mapbox_style_url || 'Not set'}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Feature Configuration</CardTitle>
              <CardDescription>
                Enable or disable application features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Photo Moderation</Label>
                    <p className="text-xs text-muted-foreground">
                      Require admin approval for uploaded photos
                    </p>
                  </div>
                  <Switch
                    checked={settings.enable_photo_moderation === 'true'}
                    onCheckedChange={(checked) => updateSetting('enable_photo_moderation', checked.toString())}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Public RSVP</Label>
                    <p className="text-xs text-muted-foreground">
                      Allow guests to submit RSVP responses
                    </p>
                  </div>
                  <Switch
                    checked={settings.enable_public_rsvp === 'true'}
                    onCheckedChange={(checked) => updateSetting('enable_public_rsvp', checked.toString())}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Gift Registry</Label>
                    <p className="text-xs text-muted-foreground">
                      Enable the gift registry feature
                    </p>
                  </div>
                  <Switch
                    checked={settings.enable_gift_registry === 'true'}
                    onCheckedChange={(checked) => updateSetting('enable_gift_registry', checked.toString())}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Appearance Settings
              </CardTitle>
              <CardDescription>
                Customize the visual appearance of your application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primary_color">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primary_color"
                      type="color"
                      value={settings.primary_color || '#2C3E50'}
                      onChange={(e) => updateSetting('primary_color', e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={settings.primary_color || '#2C3E50'}
                      onChange={(e) => updateSetting('primary_color', e.target.value)}
                      placeholder="#2C3E50"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondary_color">Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondary_color"
                      type="color"
                      value={settings.secondary_color || '#F5F2ED'}
                      onChange={(e) => updateSetting('secondary_color', e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={settings.secondary_color || '#F5F2ED'}
                      onChange={(e) => updateSetting('secondary_color', e.target.value)}
                      placeholder="#F5F2ED"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="active_background">Active Background</Label>
                <Input
                  id="active_background"
                  value={settings.active_background || ''}
                  onChange={(e) => updateSetting('active_background', e.target.value)}
                  placeholder="background 1.png"
                />
                <p className="text-xs text-muted-foreground">
                  Filename of the active background image from the backgrounds storage bucket
                </p>
              </div>

              <div className="p-4 bg-muted/20 rounded-lg">
                <h4 className="font-medium mb-2">Preview</h4>
                <div className="flex gap-4">
                  <div 
                    className="w-16 h-16 rounded-lg border-2"
                    style={{ backgroundColor: settings.primary_color || '#2C3E50' }}
                    title="Primary Color"
                  />
                  <div 
                    className="w-16 h-16 rounded-lg border-2"
                    style={{ backgroundColor: settings.secondary_color || '#F5F2ED' }}
                    title="Secondary Color"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsManager;