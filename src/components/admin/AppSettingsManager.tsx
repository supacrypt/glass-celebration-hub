import React, { useState } from 'react';
import { useAppSettings } from '@/hooks/useAppSettings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Save, RefreshCw, Settings, Calendar, MessageCircle, Heart, Image } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import HeroBackgroundManager from '@/components/admin/HeroBackgroundManager';

const AppSettingsManager: React.FC = () => {
  const { settings, loading, updateSetting, loadSettings } = useAppSettings();
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async (key: string, value: string) => {
    setIsSaving(true);
    try {
      await updateSetting(key as keyof typeof settings, value);
    } catch (error) {
      console.error('Error saving setting:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const SettingField: React.FC<{
    label: string;
    value: string;
    settingKey: string;
    type?: 'text' | 'textarea' | 'datetime-local' | 'url';
    placeholder?: string;
    rows?: number;
  }> = ({ label, value, settingKey, type = 'text', placeholder, rows = 3 }) => {
    const [localValue, setLocalValue] = useState(value);
    const [hasChanges, setHasChanges] = useState(false);

    React.useEffect(() => {
      setLocalValue(value);
      setHasChanges(false);
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setLocalValue(e.target.value);
      setHasChanges(e.target.value !== value);
    };

    const handleSaveLocal = () => {
      if (hasChanges) {
        handleSave(settingKey, localValue);
        setHasChanges(false);
      }
    };

    return (
      <div className="space-y-2">
        <Label htmlFor={settingKey} className="text-sm font-medium">{label}</Label>
        <div className="flex gap-2">
          <div className="flex-1">
            {type === 'textarea' ? (
              <Textarea
                id={settingKey}
                value={localValue}
                onChange={handleChange}
                placeholder={placeholder}
                rows={rows}
                className="resize-none"
              />
            ) : (
              <Input
                id={settingKey}
                type={type}
                value={localValue}
                onChange={handleChange}
                placeholder={placeholder}
              />
            )}
          </div>
          <Button
            onClick={handleSaveLocal}
            disabled={!hasChanges || isSaving}
            variant={hasChanges ? 'default' : 'outline'}
            size="sm"
          >
            <Save className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <GlassCard className="p-6">
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="w-6 h-6 animate-spin mr-2" />
          <span>Loading settings...</span>
        </div>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="w-6 h-6 text-wedding-navy" />
        <div>
          <h2 className="text-2xl font-bold text-wedding-navy">App Settings</h2>
          <p className="text-muted-foreground">Manage your wedding website content</p>
        </div>
      </div>

      <GlassCard className="p-6">
        <div className="space-y-6">
          <SettingField
            label="App Name"
            value={settings.app_name}
            settingKey="app_name"
            placeholder="Tim & Kirsten"
          />
          
          <SettingField
            label="Wedding Date & Time"
            value={settings.wedding_date}
            settingKey="wedding_date"
            type="datetime-local"
          />
          
          <SettingField
            label="Hero Subtitle"
            value={settings.hero_subtitle}
            settingKey="hero_subtitle"
            type="textarea"
            rows={4}
          />
          
          <SettingField
            label="Welcome Message"
            value={settings.welcome_message}
            settingKey="welcome_message"
          />
          
          <SettingField
            label="Countdown Message"
            value={settings.countdown_message}
            settingKey="countdown_message"
          />
          
          <SettingField
            label="Footer Message"
            value={settings.footer_message}
            settingKey="footer_message"
          />
        </div>
      </GlassCard>

      {/* Hero Background Manager */}
      <HeroBackgroundManager />
    </div>
  );
};

export default AppSettingsManager;