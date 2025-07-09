import React, { useState, useEffect } from 'react';
import { Palette, Upload, Download, Save, Eye, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ThemeConfig {
  id?: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  fontFamily: string;
  fontSize: string;
  backgroundImage?: string;
  customCSS?: string;
}

interface BackgroundOption {
  id: string;
  name: string;
  url: string;
  type: 'gradient' | 'image' | 'pattern';
}

const ThemeCustomization: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig>({
    name: 'Default Wedding Theme',
    primaryColor: '#2C3E50',
    secondaryColor: '#F5F2ED',
    accentColor: '#EC4899',
    backgroundColor: '#FFFFFF',
    fontFamily: 'Inter',
    fontSize: '16px'
  });

  const [savedThemes, setSavedThemes] = useState<ThemeConfig[]>([]);
  const [backgroundOptions, setBackgroundOptions] = useState<BackgroundOption[]>([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSavedThemes();
    loadBackgroundOptions();
  }, []);

  const loadSavedThemes = async () => {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('*')
        .like('setting_key', 'theme_%');

      if (error) throw error;

      const themes = data?.map(setting => ({
        id: setting.id,
        ...JSON.parse(setting.setting_value || '{}')
      })) || [];

      setSavedThemes(themes);
    } catch (error) {
      console.error('Error loading themes:', error);
    }
  };

  const loadBackgroundOptions = async () => {
    // Load from Supabase storage
    try {
      const { data, error } = await supabase.storage
        .from('backgrounds')
        .list();

      if (error) throw error;

      const backgrounds: BackgroundOption[] = (data || []).map(file => ({
        id: file.name,
        name: file.name.replace(/\.[^/.]+$/, ""),
        url: supabase.storage.from('backgrounds').getPublicUrl(file.name).data.publicUrl,
        type: 'image'
      }));

      // Add default gradients
      const defaultBackgrounds: BackgroundOption[] = [
        {
          id: 'gradient-1',
          name: 'Elegant Cream',
          url: 'linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%)',
          type: 'gradient'
        },
        {
          id: 'gradient-2',
          name: 'Romantic Pink',
          url: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)',
          type: 'gradient'
        },
        {
          id: 'gradient-3',
          name: 'Vintage Gold',
          url: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
          type: 'gradient'
        }
      ];

      setBackgroundOptions([...defaultBackgrounds, ...backgrounds]);
    } catch (error) {
      console.error('Error loading backgrounds:', error);
    }
  };

  const saveTheme = async () => {
    if (!currentTheme.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a theme name",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      
      const themeData = {
        setting_key: `theme_${currentTheme.name.toLowerCase().replace(/\s+/g, '_')}`,
        setting_value: JSON.stringify(currentTheme)
      };

      const { error } = await supabase
        .from('app_settings')
        .upsert([themeData]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Theme saved successfully",
      });

      loadSavedThemes();
    } catch (error) {
      console.error('Error saving theme:', error);
      toast({
        title: "Error",
        description: "Failed to save theme",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadTheme = (theme: ThemeConfig) => {
    setCurrentTheme(theme);
    toast({
      title: "Theme Loaded",
      description: `Applied theme: ${theme.name}`,
    });
  };

  const uploadBackgroundImage = async (file: File) => {
    try {
      setLoading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `background-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('backgrounds')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('backgrounds')
        .getPublicUrl(fileName);

      setCurrentTheme({
        ...currentTheme,
        backgroundImage: data.publicUrl
      });

      toast({
        title: "Success",
        description: "Background image uploaded successfully",
      });

      loadBackgroundOptions();
    } catch (error) {
      console.error('Error uploading background:', error);
      toast({
        title: "Error",
        description: "Failed to upload background image",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadFontFile = async (file: File) => {
    try {
      setLoading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `font-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('backgrounds') // Using same bucket for simplicity
        .upload(`fonts/${fileName}`, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('backgrounds')
        .getPublicUrl(`fonts/${fileName}`);

      // Add @font-face rule to custom CSS
      const fontName = file.name.replace(/\.[^/.]+$/, "");
      const fontFace = `@font-face {
  font-family: '${fontName}';
  src: url('${data.publicUrl}') format('${fileExt === 'woff2' ? 'woff2' : fileExt === 'woff' ? 'woff' : 'truetype'}');
}`;

      setCurrentTheme({
        ...currentTheme,
        customCSS: (currentTheme.customCSS || '') + '\n' + fontFace,
        fontFamily: fontName
      });

      toast({
        title: "Success",
        description: "Font uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading font:', error);
      toast({
        title: "Error",
        description: "Failed to upload font file",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const exportTheme = () => {
    const themeCSS = `
/* Custom Wedding Theme: ${currentTheme.name} */
:root {
  --primary-color: ${currentTheme.primaryColor};
  --secondary-color: ${currentTheme.secondaryColor};
  --accent-color: ${currentTheme.accentColor};
  --background-color: ${currentTheme.backgroundColor};
  --font-family: ${currentTheme.fontFamily};
  --font-size: ${currentTheme.fontSize};
}

body {
  font-family: var(--font-family), sans-serif;
  font-size: var(--font-size);
  background: ${currentTheme.backgroundImage ? `url(${currentTheme.backgroundImage})` : currentTheme.backgroundColor};
}

${currentTheme.customCSS || ''}
`;

    const blob = new Blob([themeCSS], { type: 'text/css' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentTheme.name.toLowerCase().replace(/\s+/g, '-')}-theme.css`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const resetToDefault = () => {
    setCurrentTheme({
      name: 'Default Wedding Theme',
      primaryColor: '#2C3E50',
      secondaryColor: '#F5F2ED',
      accentColor: '#EC4899',
      backgroundColor: '#FFFFFF',
      fontFamily: 'Inter',
      fontSize: '16px'
    });
  };

  const applyThemePreview = () => {
    if (isPreviewMode) {
      // Apply theme styles to document
      const style = document.createElement('style');
      style.id = 'theme-preview';
      style.textContent = `
        :root {
          --wedding-navy: ${currentTheme.primaryColor};
          --glass-cream: ${currentTheme.secondaryColor};
          --glass-pink: ${currentTheme.accentColor};
        }
        ${currentTheme.customCSS || ''}
      `;
      document.head.appendChild(style);
    } else {
      // Remove preview styles
      const existingStyle = document.getElementById('theme-preview');
      if (existingStyle) {
        existingStyle.remove();
      }
    }
  };

  useEffect(() => {
    applyThemePreview();
    return () => {
      const existingStyle = document.getElementById('theme-preview');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, [isPreviewMode, currentTheme]);

  return (
    <div className="space-y-4 h-full overflow-y-auto" style={{ maxHeight: '580px' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-wedding-navy" />
          <h3 className="font-semibold text-wedding-navy">Theme Customization</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={isPreviewMode ? "default" : "outline"}
            onClick={() => setIsPreviewMode(!isPreviewMode)}
          >
            <Eye className="w-3 h-3 mr-1" />
            {isPreviewMode ? 'Exit Preview' : 'Preview'}
          </Button>
          <Button size="sm" variant="outline" onClick={exportTheme}>
            <Download className="w-3 h-3 mr-1" />
            Export
          </Button>
          <Button size="sm" onClick={saveTheme} disabled={loading}>
            <Save className="w-3 h-3 mr-1" />
            Save
          </Button>
        </div>
      </div>

      {/* Theme Name */}
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Theme Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-xs">Theme Name</Label>
            <Input
              value={currentTheme.name}
              onChange={(e) => setCurrentTheme({ ...currentTheme, name: e.target.value })}
              placeholder="My Custom Theme"
              className="text-sm"
            />
          </div>
          
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={resetToDefault}>
              <RotateCcw className="w-3 h-3 mr-1" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Color Palette */}
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Color Palette</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Primary Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={currentTheme.primaryColor}
                  onChange={(e) => setCurrentTheme({ ...currentTheme, primaryColor: e.target.value })}
                  className="w-12 h-8 p-1 rounded border"
                />
                <Input
                  value={currentTheme.primaryColor}
                  onChange={(e) => setCurrentTheme({ ...currentTheme, primaryColor: e.target.value })}
                  placeholder="#2C3E50"
                  className="text-xs"
                />
              </div>
            </div>
            
            <div>
              <Label className="text-xs">Secondary Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={currentTheme.secondaryColor}
                  onChange={(e) => setCurrentTheme({ ...currentTheme, secondaryColor: e.target.value })}
                  className="w-12 h-8 p-1 rounded border"
                />
                <Input
                  value={currentTheme.secondaryColor}
                  onChange={(e) => setCurrentTheme({ ...currentTheme, secondaryColor: e.target.value })}
                  placeholder="#F5F2ED"
                  className="text-xs"
                />
              </div>
            </div>
            
            <div>
              <Label className="text-xs">Accent Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={currentTheme.accentColor}
                  onChange={(e) => setCurrentTheme({ ...currentTheme, accentColor: e.target.value })}
                  className="w-12 h-8 p-1 rounded border"
                />
                <Input
                  value={currentTheme.accentColor}
                  onChange={(e) => setCurrentTheme({ ...currentTheme, accentColor: e.target.value })}
                  placeholder="#EC4899"
                  className="text-xs"
                />
              </div>
            </div>
            
            <div>
              <Label className="text-xs">Background</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={currentTheme.backgroundColor}
                  onChange={(e) => setCurrentTheme({ ...currentTheme, backgroundColor: e.target.value })}
                  className="w-12 h-8 p-1 rounded border"
                />
                <Input
                  value={currentTheme.backgroundColor}
                  onChange={(e) => setCurrentTheme({ ...currentTheme, backgroundColor: e.target.value })}
                  placeholder="#FFFFFF"
                  className="text-xs"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Typography */}
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Typography</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Font Family</Label>
              <Select value={currentTheme.fontFamily} onValueChange={(value) => setCurrentTheme({ ...currentTheme, fontFamily: value })}>
                <SelectTrigger className="text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inter">Inter</SelectItem>
                  <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                  <SelectItem value="Dancing Script">Dancing Script</SelectItem>
                  <SelectItem value="Cinzel">Cinzel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-xs">Font Size</Label>
              <Select value={currentTheme.fontSize} onValueChange={(value) => setCurrentTheme({ ...currentTheme, fontSize: value })}>
                <SelectTrigger className="text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="14px">Small (14px)</SelectItem>
                  <SelectItem value="16px">Medium (16px)</SelectItem>
                  <SelectItem value="18px">Large (18px)</SelectItem>
                  <SelectItem value="20px">Extra Large (20px)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label className="text-xs">Upload Custom Font</Label>
            <div className="flex gap-2">
              <Input
                type="file"
                accept=".woff,.woff2,.ttf,.otf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadFontFile(file);
                }}
                className="text-xs"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Background Options */}
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Background</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-xs">Background Options</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              {backgroundOptions.slice(0, 6).map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => setCurrentTheme({ ...currentTheme, backgroundImage: bg.url })}
                  className={`aspect-video rounded border-2 transition-colors ${
                    currentTheme.backgroundImage === bg.url 
                      ? 'border-wedding-navy' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{
                    background: bg.type === 'gradient' ? bg.url : `url(${bg.url}) center/cover`
                  }}
                  title={bg.name}
                />
              ))}
            </div>
          </div>
          
          <div>
            <Label className="text-xs">Upload Custom Background</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadBackgroundImage(file);
              }}
              className="text-xs"
            />
          </div>
        </CardContent>
      </Card>

      {/* Custom CSS */}
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Advanced Customization</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label className="text-xs">Custom CSS</Label>
            <Textarea
              value={currentTheme.customCSS || ''}
              onChange={(e) => setCurrentTheme({ ...currentTheme, customCSS: e.target.value })}
              placeholder="/* Add your custom CSS here */"
              className="text-xs font-mono min-h-20"
            />
          </div>
        </CardContent>
      </Card>

      {/* Saved Themes */}
      {savedThemes.length > 0 && (
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Saved Themes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {savedThemes.map((theme) => (
                <div key={theme.id} className="flex items-center justify-between p-2 rounded border">
                  <span className="text-xs font-medium">{theme.name}</span>
                  <Button size="sm" variant="outline" onClick={() => loadTheme(theme)}>
                    Load
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ThemeCustomization;