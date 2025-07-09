import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAppSettings } from '@/hooks/useAppSettings';
import { Calendar, Heart, MessageSquare, Settings, Users, Clock } from 'lucide-react';

const AppSettingsManager: React.FC = () => {
  const { settings, loading, updateSetting } = useAppSettings();
  const [localSettings, setLocalSettings] = useState(settings);

  React.useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleSave = async (key: keyof typeof settings) => {
    await updateSetting(key, localSettings[key]);
  };

  const handleSaveAll = async () => {
    for (const [key, value] of Object.entries(localSettings)) {
      await updateSetting(key as keyof typeof settings, value);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-glass-blue/20 rounded mb-4"></div>
          <div className="grid gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-24 bg-glass-blue/20 rounded"></div>
            ))}
          </div>
        </div>
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
            App Settings
          </h2>
          <p className="text-muted-foreground">Configure core app content and behaviour</p>
        </div>
        <Button onClick={handleSaveAll} className="glass-button">
          Save All Changes
        </Button>
      </div>

      {/* Basic Information */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="app_name">App Name</Label>
              <Input
                id="app_name"
                value={localSettings.app_name}
                onChange={(e) => setLocalSettings(prev => ({ ...prev, app_name: e.target.value }))}
                placeholder="e.g., Tim & Kirsten"
              />
            </div>
            <div>
              <Label htmlFor="wedding_date">Wedding Date & Time</Label>
              <Input
                id="wedding_date"
                type="datetime-local"
                value={localSettings.wedding_date?.slice(0, 16)}
                onChange={(e) => setLocalSettings(prev => ({ ...prev, wedding_date: e.target.value + ':00' }))}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bride_name">Bride's Name</Label>
              <Input
                id="bride_name"
                value={localSettings.bride_name}
                onChange={(e) => setLocalSettings(prev => ({ ...prev, bride_name: e.target.value }))}
                placeholder="e.g., Kirsten"
              />
            </div>
            <div>
              <Label htmlFor="groom_name">Groom's Name</Label>
              <Input
                id="groom_name"
                value={localSettings.groom_name}
                onChange={(e) => setLocalSettings(prev => ({ ...prev, groom_name: e.target.value }))}
                placeholder="e.g., Tim"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Management */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Content Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Welcome Section */}
          <div className="space-y-4">
            <h4 className="font-semibold text-wedding-navy">Home Page Content</h4>
            <div>
              <Label htmlFor="welcome_message">Welcome Title</Label>
              <Input
                id="welcome_message"
                value={localSettings.welcome_message}
                onChange={(e) => setLocalSettings(prev => ({ ...prev, welcome_message: e.target.value }))}
                placeholder="e.g., We Can't Wait to Celebrate With You!"
              />
            </div>
            <div>
              <Label htmlFor="welcome_subtitle">Welcome Subtitle</Label>
              <Textarea
                id="welcome_subtitle"
                value={localSettings.welcome_subtitle}
                onChange={(e) => setLocalSettings(prev => ({ ...prev, welcome_subtitle: e.target.value }))}
                rows={3}
                placeholder="Detailed welcome message for guests"
              />
            </div>
            <div>
              <Label htmlFor="hero_subtitle">Hero Section Subtitle</Label>
              <Input
                id="hero_subtitle"
                value={localSettings.hero_subtitle}
                onChange={(e) => setLocalSettings(prev => ({ ...prev, hero_subtitle: e.target.value }))}
                placeholder="e.g., Join us as we begin our new chapter together"
              />
            </div>
          </div>

          <Separator />

          {/* Event Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-wedding-navy">Event Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ceremony_time">Ceremony Time</Label>
                <Input
                  id="ceremony_time"
                  value={localSettings.ceremony_time}
                  onChange={(e) => setLocalSettings(prev => ({ ...prev, ceremony_time: e.target.value }))}
                  placeholder="e.g., 3:00 PM"
                />
              </div>
              <div>
                <Label htmlFor="arrival_time">Arrival Time</Label>
                <Input
                  id="arrival_time"
                  value={localSettings.arrival_time}
                  onChange={(e) => setLocalSettings(prev => ({ ...prev, arrival_time: e.target.value }))}
                  placeholder="e.g., 2:30 PM"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="countdown_message">Countdown Message</Label>
              <Input
                id="countdown_message"
                value={localSettings.countdown_message}
                onChange={(e) => setLocalSettings(prev => ({ ...prev, countdown_message: e.target.value }))}
                placeholder="e.g., Until our special day"
              />
            </div>
          </div>

          <Separator />

          {/* Gallery Content */}
          <div className="space-y-4">
            <h4 className="font-semibold text-wedding-navy">Gallery Settings</h4>
            <div>
              <Label htmlFor="gallery_title">Gallery Title</Label>
              <Input
                id="gallery_title"
                value={localSettings.gallery_title}
                onChange={(e) => setLocalSettings(prev => ({ ...prev, gallery_title: e.target.value }))}
                placeholder="e.g., Our Wedding Gallery"
              />
            </div>
            <div>
              <Label htmlFor="gallery_description">Gallery Description</Label>
              <Input
                id="gallery_description"
                value={localSettings.gallery_description}
                onChange={(e) => setLocalSettings(prev => ({ ...prev, gallery_description: e.target.value }))}
                placeholder="e.g., Capturing our most precious moments"
              />
            </div>
          </div>

          <Separator />

          {/* RSVP Instructions */}
          <div className="space-y-4">
            <h4 className="font-semibold text-wedding-navy">RSVP Settings</h4>
            <div>
              <Label htmlFor="rsvp_instructions">RSVP Instructions</Label>
              <Textarea
                id="rsvp_instructions"
                value={localSettings.rsvp_instructions}
                onChange={(e) => setLocalSettings(prev => ({ ...prev, rsvp_instructions: e.target.value }))}
                rows={3}
                placeholder="Instructions for guests on how to RSVP"
              />
            </div>
          </div>

          <Separator />

          {/* About & Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-wedding-navy">About & Contact</h4>
            <div>
              <Label htmlFor="about_section">About Section</Label>
              <Textarea
                id="about_section"
                value={localSettings.about_section}
                onChange={(e) => setLocalSettings(prev => ({ ...prev, about_section: e.target.value }))}
                rows={3}
                placeholder="Tell your guests about yourselves and the wedding"
              />
            </div>
            <div>
              <Label htmlFor="contact_message">Contact Message</Label>
              <Input
                id="contact_message"
                value={localSettings.contact_message}
                onChange={(e) => setLocalSettings(prev => ({ ...prev, contact_message: e.target.value }))}
                placeholder="e.g., For any questions about the wedding, please don't hesitate to reach out to us."
              />
            </div>
            <div>
              <Label htmlFor="footer_message">Footer Message</Label>
              <Input
                id="footer_message"
                value={localSettings.footer_message}
                onChange={(e) => setLocalSettings(prev => ({ ...prev, footer_message: e.target.value }))}
                placeholder="e.g., With love, Tim & Kirsten"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gift Registry Management */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🎁 Gift Registry
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="external_gift_registry_url">External Gift Registry URL</Label>
            <Input
              id="external_gift_registry_url"
              value={localSettings.external_gift_registry_url}
              onChange={(e) => setLocalSettings(prev => ({ ...prev, external_gift_registry_url: e.target.value }))}
              placeholder="https://mygiftregistry.com.au/id/tim-and-kirsten/"
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground mt-1">
              The home page "Gifts" button will redirect to this URL
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Live Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-6 bg-gradient-to-br from-glass-blue/5 to-glass-purple/5">
            <div className="text-center space-y-4">
              <div className="text-4xl">💕</div>
              <h1 className="text-3xl font-bold text-wedding-navy bg-gradient-to-r from-glass-blue to-glass-purple bg-clip-text text-transparent">
                {localSettings.app_name}
              </h1>
              <p className="text-lg text-glass-blue font-medium">
                {new Date(localSettings.wedding_date).toLocaleDateString('en-AU', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                {localSettings.welcome_message}
              </p>
              <p className="text-xs text-muted-foreground/80">
                {localSettings.footer_message}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppSettingsManager;