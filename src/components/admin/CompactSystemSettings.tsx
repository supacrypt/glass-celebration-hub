import React, { useState, useEffect } from 'react';
import { Settings, Save, Eye, EyeOff, Key, Bell, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AppSetting {
  id: string;
  setting_key: string;
  setting_value: string | null;
}

const CompactSystemSettings: React.FC = () => {
  const [settings, setSettings] = useState<AppSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [showSecrets, setShowSecrets] = useState(false);
  const { toast } = useToast();

  const defaultSettings = [
    { key: 'app_name', label: 'App Name', type: 'text', defaultValue: 'Wedding App' },
    { key: 'welcome_message', label: 'Welcome Message', type: 'text', defaultValue: 'Welcome to our wedding!' },
    { key: 'max_photo_size', label: 'Max Photo Size (MB)', type: 'number', defaultValue: '10' },
    { key: 'auto_approve_photos', label: 'Auto Approve Photos', type: 'boolean', defaultValue: 'false' },
    { key: 'email_notifications', label: 'Email Notifications', type: 'boolean', defaultValue: 'true' },
    { key: 'guest_upload_enabled', label: 'Guest Upload Enabled', type: 'boolean', defaultValue: 'true' },
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('*');

      if (error) throw error;
      setSettings(data || []);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: string) => {
    setSaving(key);
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

      toast({
        title: "Success",
        description: "Setting updated successfully",
      });
      
      fetchSettings();
    } catch (error) {
      console.error('Error updating setting:', error);
      toast({
        title: "Error",
        description: "Failed to update setting",
        variant: "destructive"
      });
    } finally {
      setSaving(null);
    }
  };

  const getSettingValue = (key: string) => {
    const setting = settings.find(s => s.setting_key === key);
    const defaultSetting = defaultSettings.find(s => s.key === key);
    return setting?.setting_value || defaultSetting?.defaultValue || '';
  };

  const handleInputChange = (key: string, value: string) => {
    setSettings(prev => {
      const existing = prev.find(s => s.setting_key === key);
      if (existing) {
        return prev.map(s => s.setting_key === key ? { ...s, setting_value: value } : s);
      } else {
        return [...prev, { id: 'temp', setting_key: key, setting_value: value }];
      }
    });
  };

  const systemStats = {
    totalUsers: 0, // Would be fetched from actual data
    totalPhotos: 0,
    storageUsed: '0 MB',
    lastBackup: 'Never',
  };

  if (loading) {
    return <div className="text-center py-4">Loading settings...</div>;
  }

  return (
    <div className="space-y-4">
      {/* System Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="glass-card p-3 text-center">
          <Shield className="w-4 h-4 mx-auto text-glass-blue mb-1" />
          <div className="text-sm font-semibold">System</div>
          <div className="text-xs text-muted-foreground">Operational</div>
        </div>
        <div className="glass-card p-3 text-center">
          <Settings className="w-4 h-4 mx-auto text-glass-purple mb-1" />
          <div className="text-sm font-semibold">{settings.length}</div>
          <div className="text-xs text-muted-foreground">Settings</div>
        </div>
      </div>

      {/* Settings List */}
      <div className="space-y-3 max-h-60 overflow-y-auto">
        {defaultSettings.map((setting) => {
          const currentValue = getSettingValue(setting.key);
          
          return (
            <div key={setting.key} className="glass-card p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-sm font-medium text-wedding-navy">
                    {setting.label}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {setting.key}
                  </div>
                </div>
                
                <Badge variant="outline" className="text-xs">
                  {setting.type}
                </Badge>
              </div>
              
              <div className="flex items-center space-x-2">
                {setting.type === 'boolean' ? (
                  <div className="flex items-center space-x-2 flex-1">
                    <Switch
                      checked={currentValue === 'true'}
                      onCheckedChange={(checked) => {
                        const newValue = checked.toString();
                        handleInputChange(setting.key, newValue);
                        updateSetting(setting.key, newValue);
                      }}
                      disabled={saving === setting.key}
                    />
                    <span className="text-sm text-muted-foreground">
                      {currentValue === 'true' ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                ) : (
                  <>
                    <Input
                      type={setting.type === 'number' ? 'number' : 'text'}
                      value={currentValue}
                      onChange={(e) => handleInputChange(setting.key, e.target.value)}
                      className="flex-1 text-sm"
                      placeholder={setting.defaultValue}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateSetting(setting.key, currentValue)}
                      disabled={saving === setting.key}
                      className="text-xs px-2 py-1 h-8"
                    >
                      {saving === setting.key ? (
                        <div className="w-3 h-3 animate-spin rounded-full border border-current border-t-transparent" />
                      ) : (
                        <Save className="w-3 h-3" />
                      )}
                    </Button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* System Actions */}
      <div className="glass-card p-3 space-y-2">
        <h4 className="text-sm font-medium text-wedding-navy">System Actions</h4>
        <div className="grid grid-cols-2 gap-2">
          <Button size="sm" variant="outline" className="text-xs">
            <Settings className="w-3 h-3 mr-1" />
            Export Data
          </Button>
          <Button size="sm" variant="outline" className="text-xs">
            <Shield className="w-3 h-3 mr-1" />
            Backup
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompactSystemSettings;