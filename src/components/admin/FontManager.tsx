import React, { useState, useEffect } from 'react';
import { Type, Eye, Save, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FontSettings {
  primaryFont: string;
  headingFont: string;
  bodyFont: string;
  fontScale: number;
  lineHeight: number;
}

const FontManager: React.FC = () => {
  const [fontSettings, setFontSettings] = useState<FontSettings>({
    primaryFont: 'Inter',
    headingFont: 'Inter',
    bodyFont: 'Inter',
    fontScale: 1.0,
    lineHeight: 1.5,
  });
  
  const [previewText, setPreviewText] = useState('heading');
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const googleFonts = [
    { name: 'Inter', category: 'Sans Serif', popular: true },
    { name: 'Playfair Display', category: 'Serif', popular: true },
    { name: 'Montserrat', category: 'Sans Serif', popular: true },
    { name: 'Crimson Text', category: 'Serif', popular: false },
    { name: 'Lato', category: 'Sans Serif', popular: true },
    { name: 'Merriweather', category: 'Serif', popular: true },
    { name: 'Open Sans', category: 'Sans Serif', popular: true },
    { name: 'Poppins', category: 'Sans Serif', popular: true },
    { name: 'Roboto', category: 'Sans Serif', popular: false },
    { name: 'Source Sans Pro', category: 'Sans Serif', popular: false },
    { name: 'Cormorant Garamond', category: 'Serif', popular: false },
    { name: 'Dancing Script', category: 'Handwriting', popular: false },
  ];

  useEffect(() => {
    loadFontSettings();
  }, []);

  const loadFontSettings = async () => {
    try {
      const { data } = await supabase
        .from('app_settings')
        .select('setting_key, setting_value')
        .in('setting_key', [
          'font_primary', 'font_heading', 'font_body', 
          'font_scale', 'line_height'
        ]);

      if (data && data.length > 0) {
        const settings: Partial<FontSettings> = {};
        data.forEach(setting => {
          switch (setting.setting_key) {
            case 'font_primary':
              settings.primaryFont = setting.setting_value || 'Inter';
              break;
            case 'font_heading':
              settings.headingFont = setting.setting_value || 'Inter';
              break;
            case 'font_body':
              settings.bodyFont = setting.setting_value || 'Inter';
              break;
            case 'font_scale':
              settings.fontScale = parseFloat(setting.setting_value || '1.0');
              break;
            case 'line_height':
              settings.lineHeight = parseFloat(setting.setting_value || '1.5');
              break;
          }
        });
        
        setFontSettings(prev => ({ ...prev, ...settings }));
      }
    } catch (error) {
      console.error('Error loading font settings:', error);
    }
  };

  const loadGoogleFont = (fontName: string) => {
    if (fontName === 'Inter') return; // Already loaded
    
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(' ', '+')}:wght@300;400;500;600;700&display=swap`;
    link.rel = 'stylesheet';
    
    if (!document.querySelector(`link[href*="${fontName.replace(' ', '+')}"]`)) {
      document.head.appendChild(link);
    }
  };

  const applyFontPreview = (settings: FontSettings) => {
    loadGoogleFont(settings.primaryFont);
    loadGoogleFont(settings.headingFont);
    loadGoogleFont(settings.bodyFont);
    
    // Apply to CSS variables for preview
    document.documentElement.style.setProperty('--font-primary', `"${settings.primaryFont}", sans-serif`);
    document.documentElement.style.setProperty('--font-heading', `"${settings.headingFont}", sans-serif`);
    document.documentElement.style.setProperty('--font-body', `"${settings.bodyFont}", sans-serif`);
    document.documentElement.style.setProperty('--font-scale', settings.fontScale.toString());
    document.documentElement.style.setProperty('--line-height', settings.lineHeight.toString());
  };

  const saveFontSettings = async () => {
    setSaving(true);
    try {
      const settingsToSave = [
        { setting_key: 'font_primary', setting_value: fontSettings.primaryFont },
        { setting_key: 'font_heading', setting_value: fontSettings.headingFont },
        { setting_key: 'font_body', setting_value: fontSettings.bodyFont },
        { setting_key: 'font_scale', setting_value: fontSettings.fontScale.toString() },
        { setting_key: 'line_height', setting_value: fontSettings.lineHeight.toString() },
      ];

      for (const setting of settingsToSave) {
        await supabase
          .from('app_settings')
          .upsert(setting, { onConflict: 'setting_key' });
      }

      applyFontPreview(fontSettings);
      
      toast({
        title: "Fonts Saved",
        description: "Typography settings have been applied",
      });
    } catch (error) {
      console.error('Error saving font settings:', error);
      toast({
        title: "Error",
        description: "Failed to save font settings",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleFontChange = (type: keyof FontSettings, value: string | number) => {
    const newSettings = { ...fontSettings, [type]: value };
    setFontSettings(newSettings);
    applyFontPreview(newSettings);
  };

  const previewTexts = {
    heading: "Sarah & Michael's Wedding",
    body: "Join us for a celebration of love, laughter, and happily ever after. Your presence would make our special day even more memorable.",
    display: "Save the Date"
  };

  return (
    <div className="space-y-4">
      {/* Font Manager Header */}
      <div className="flex items-center justify-between glass-card p-3">
        <div className="flex items-center gap-2">
          <Type className="w-4 h-4 text-glass-green" />
          <span className="text-sm font-medium">Font Manager</span>
        </div>
        <div className="flex gap-1">
          {Object.keys(previewTexts).map((type) => (
            <Button
              key={type}
              size="sm"
              variant={previewText === type ? "default" : "outline"}
              onClick={() => setPreviewText(type)}
              className="text-xs capitalize"
            >
              {type}
            </Button>
          ))}
        </div>
      </div>

      {/* Font Preview */}
      <div className="glass-card p-4 space-y-2">
        <Label className="text-xs text-muted-foreground">Preview</Label>
        <div 
          className="p-4 bg-muted/20 rounded-lg"
          style={{
            fontFamily: previewText === 'heading' ? fontSettings.headingFont : 
                      previewText === 'body' ? fontSettings.bodyFont : 
                      fontSettings.primaryFont,
            fontSize: previewText === 'heading' ? `${1.5 * fontSettings.fontScale}rem` :
                     previewText === 'display' ? `${2.5 * fontSettings.fontScale}rem` :
                     `${1 * fontSettings.fontScale}rem`,
            lineHeight: fontSettings.lineHeight,
            fontWeight: previewText === 'display' ? '300' : previewText === 'heading' ? '500' : '400'
          }}
        >
          {previewTexts[previewText as keyof typeof previewTexts]}
        </div>
      </div>

      {/* Font Selection */}
      <div className="space-y-3">
        {/* Primary Font */}
        <div className="glass-card p-3 space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Primary Font</Label>
            <Badge variant="outline" className="text-xs">UI Elements</Badge>
          </div>
          <Select
            value={fontSettings.primaryFont}
            onValueChange={(value) => handleFontChange('primaryFont', value)}
          >
            <SelectTrigger className="text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {googleFonts.map((font) => (
                <SelectItem key={font.name} value={font.name}>
                  <span style={{ fontFamily: font.name }}>{font.name}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Heading Font */}
        <div className="glass-card p-3 space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Heading Font</Label>
            <Badge variant="outline" className="text-xs">Titles</Badge>
          </div>
          <Select
            value={fontSettings.headingFont}
            onValueChange={(value) => handleFontChange('headingFont', value)}
          >
            <SelectTrigger className="text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {googleFonts.map((font) => (
                <SelectItem key={font.name} value={font.name}>
                  <span style={{ fontFamily: font.name }}>{font.name}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Body Font */}
        <div className="glass-card p-3 space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm">Body Font</Label>
            <Badge variant="outline" className="text-xs">Content</Badge>
          </div>
          <Select
            value={fontSettings.bodyFont}
            onValueChange={(value) => handleFontChange('bodyFont', value)}
          >
            <SelectTrigger className="text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {googleFonts.map((font) => (
                <SelectItem key={font.name} value={font.name}>
                  <span style={{ fontFamily: font.name }}>{font.name}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Typography Scale */}
        <div className="glass-card p-3 space-y-3">
          <Label className="text-sm">Typography Scale</Label>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Font Size Scale</Label>
              <Badge variant="outline" className="text-xs">{fontSettings.fontScale}x</Badge>
            </div>
            <Slider
              value={[fontSettings.fontScale]}
              onValueChange={(value) => handleFontChange('fontScale', value[0])}
              min={0.8}
              max={1.4}
              step={0.05}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Line Height</Label>
              <Badge variant="outline" className="text-xs">{fontSettings.lineHeight}</Badge>
            </div>
            <Slider
              value={[fontSettings.lineHeight]}
              onValueChange={(value) => handleFontChange('lineHeight', value[0])}
              min={1.2}
              max={2.0}
              step={0.1}
              className="w-full"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={saveFontSettings}
            disabled={saving}
            className="flex-1 text-xs"
          >
            {saving ? (
              <div className="w-3 h-3 animate-spin rounded-full border border-current border-t-transparent mr-1" />
            ) : (
              <Save className="w-3 h-3 mr-1" />
            )}
            Save Fonts
          </Button>
          <Button
            onClick={() => {
              const defaultSettings: FontSettings = {
                primaryFont: 'Inter',
                headingFont: 'Inter', 
                bodyFont: 'Inter',
                fontScale: 1.0,
                lineHeight: 1.5,
              };
              setFontSettings(defaultSettings);
              applyFontPreview(defaultSettings);
            }}
            variant="outline"
            className="text-xs"
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FontManager;