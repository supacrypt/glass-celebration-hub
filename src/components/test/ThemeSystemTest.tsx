import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertCircle, Settings, Type, Image, Database } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAppSettings } from '@/hooks/useAppSettings';
import ThemeCustomization from '@/components/admin/ThemeCustomization';
import FontManager from '@/components/admin/FontManager';
import BackgroundManager from '@/components/admin/BackgroundManager';
import DatabaseTest from '@/components/test/DatabaseTest';

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  details?: string;
}

const ThemeSystemTest: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<'test' | 'theme' | 'font' | 'background' | 'database'>('test');
  const { toast } = useToast();
  const appSettings = useAppSettings();

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    const results: TestResult[] = [];

    // Test 1: Database Connection
    try {
      const { data, error } = await supabase.from('app_settings').select('*').limit(1);
      if (error) throw error;
      results.push({
        name: 'Database Connection',
        status: 'pass',
        message: 'Successfully connected to app_settings table',
        details: `Found ${data?.length || 0} settings records`
      });
    } catch (error: any) {
      results.push({
        name: 'Database Connection',
        status: 'fail',
        message: 'Failed to connect to app_settings table',
        details: error.message
      });
    }

    // Test 2: Theme Settings Persistence
    try {
      const testTheme = {
        setting_key: 'test_theme_setting',
        setting_value: JSON.stringify({
          primaryColor: '#FF0000',
          secondaryColor: '#00FF00',
          accentColor: '#0000FF'
        })
      };

      const { error: insertError } = await supabase
        .from('app_settings')
        .upsert([testTheme]);

      if (insertError) throw insertError;

      const { data: retrievedData, error: retrieveError } = await supabase
        .from('app_settings')
        .select('*')
        .eq('setting_key', 'test_theme_setting')
        .single();

      if (retrieveError) throw retrieveError;

      const parsedValue = JSON.parse(retrievedData.setting_value);
      if (parsedValue.primaryColor === '#FF0000') {
        results.push({
          name: 'Theme Settings Persistence',
          status: 'pass',
          message: 'Theme settings are correctly saved and retrieved',
          details: 'Upsert and retrieval operations successful'
        });
      } else {
        throw new Error('Retrieved data does not match saved data');
      }

      // Cleanup test data
      await supabase
        .from('app_settings')
        .delete()
        .eq('setting_key', 'test_theme_setting');

    } catch (error: any) {
      results.push({
        name: 'Theme Settings Persistence',
        status: 'fail',
        message: 'Failed to save or retrieve theme settings',
        details: error.message
      });
    }

    // Test 3: Font Loading Test
    try {
      const testFont = 'Playfair Display';
      const link = document.createElement('link');
      link.href = `https://fonts.googleapis.com/css2?family=${testFont.replace(' ', '+')}:wght@300;400;500;600;700&display=swap`;
      link.rel = 'stylesheet';
      
      const fontLoadPromise = new Promise<void>((resolve, reject) => {
        link.onload = () => resolve();
        link.onerror = () => reject(new Error('Font failed to load'));
        setTimeout(() => reject(new Error('Font load timeout')), 5000);
      });

      document.head.appendChild(link);
      await fontLoadPromise;

      // Test if font is actually available
      const testElement = document.createElement('div');
      testElement.style.fontFamily = testFont;
      testElement.style.position = 'absolute';
      testElement.style.visibility = 'hidden';
      testElement.textContent = 'Test';
      document.body.appendChild(testElement);

      const computedStyle = window.getComputedStyle(testElement);
      const actualFont = computedStyle.fontFamily;
      
      document.body.removeChild(testElement);
      document.head.removeChild(link);

      if (actualFont.includes(testFont)) {
        results.push({
          name: 'Google Fonts Loading',
          status: 'pass',
          message: 'Google Fonts are loading correctly',
          details: `Successfully loaded ${testFont}`
        });
      } else {
        results.push({
          name: 'Google Fonts Loading',
          status: 'warning',
          message: 'Font loaded but may not be applied correctly',
          details: `Expected: ${testFont}, Actual: ${actualFont}`
        });
      }
    } catch (error: any) {
      results.push({
        name: 'Google Fonts Loading',
        status: 'fail',
        message: 'Failed to load Google Fonts',
        details: error.message
      });
    }

    // Test 4: Background Storage Test
    try {
      const { data: storageData, error: storageError } = await supabase.storage
        .from('backgrounds')
        .list('', { limit: 10 });

      if (storageError) {
        // Try to create the bucket if it doesn't exist
        const { error: createError } = await supabase.storage
          .createBucket('backgrounds', {
            public: true,
            fileSizeLimit: 50 * 1024 * 1024, // 50MB
            allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
          });

        if (createError && !createError.message.includes('already exists')) {
          throw createError;
        }

        results.push({
          name: 'Background Storage',
          status: 'warning',
          message: 'Background storage bucket created or already exists',
          details: 'Storage is available for background images'
        });
      } else {
        results.push({
          name: 'Background Storage',
          status: 'pass',
          message: 'Background storage is accessible',
          details: `Found ${storageData?.length || 0} background files`
        });
      }
    } catch (error: any) {
      results.push({
        name: 'Background Storage',
        status: 'fail',
        message: 'Background storage is not accessible',
        details: error.message
      });
    }

    // Test 5: CSS Variables Application
    try {
      const originalValue = getComputedStyle(document.documentElement).getPropertyValue('--wedding-navy');
      
      document.documentElement.style.setProperty('--wedding-navy', '#123456');
      const newValue = getComputedStyle(document.documentElement).getPropertyValue('--wedding-navy');
      
      if (newValue.trim() === '#123456') {
        results.push({
          name: 'CSS Variables Application',
          status: 'pass',
          message: 'CSS variables are being applied correctly',
          details: 'Theme variables can be updated dynamically'
        });
      } else {
        results.push({
          name: 'CSS Variables Application',
          status: 'warning',
          message: 'CSS variables may not be applying as expected',
          details: `Expected: #123456, Actual: ${newValue}`
        });
      }

      // Restore original value
      if (originalValue) {
        document.documentElement.style.setProperty('--wedding-navy', originalValue);
      }
    } catch (error: any) {
      results.push({
        name: 'CSS Variables Application',
        status: 'fail',
        message: 'Failed to apply CSS variables',
        details: error.message
      });
    }

    // Test 6: Settings Hook Integration
    try {
      if (appSettings.loading) {
        results.push({
          name: 'Settings Hook Integration',
          status: 'warning',
          message: 'Settings are still loading',
          details: 'useAppSettings hook is functional but data is loading'
        });
      } else {
        results.push({
          name: 'Settings Hook Integration',
          status: 'pass',
          message: 'Settings hook is working correctly',
          details: `Loaded settings for ${appSettings.settings.app_name}`
        });
      }
    } catch (error: any) {
      results.push({
        name: 'Settings Hook Integration',
        status: 'fail',
        message: 'Settings hook is not working',
        details: error.message
      });
    }

    // Test 7: Font Settings Persistence
    try {
      const fontSettings = [
        { setting_key: 'font_primary', setting_value: 'Inter' },
        { setting_key: 'font_heading', setting_value: 'Playfair Display' },
        { setting_key: 'font_body', setting_value: 'Lato' },
        { setting_key: 'font_scale', setting_value: '1.2' },
        { setting_key: 'line_height', setting_value: '1.6' }
      ];

      for (const setting of fontSettings) {
        const { error } = await supabase
          .from('app_settings')
          .upsert(setting, { onConflict: 'setting_key' });
        
        if (error) throw error;
      }

      const { data: retrievedFontSettings, error: retrieveError } = await supabase
        .from('app_settings')
        .select('*')
        .in('setting_key', fontSettings.map(s => s.setting_key));

      if (retrieveError) throw retrieveError;

      if (retrievedFontSettings.length === fontSettings.length) {
        results.push({
          name: 'Font Settings Persistence',
          status: 'pass',
          message: 'Font settings are persisted correctly',
          details: `All ${fontSettings.length} font settings saved successfully`
        });
      } else {
        results.push({
          name: 'Font Settings Persistence',
          status: 'warning',
          message: 'Some font settings may not be persisted',
          details: `Expected ${fontSettings.length}, got ${retrievedFontSettings.length}`
        });
      }
    } catch (error: any) {
      results.push({
        name: 'Font Settings Persistence',
        status: 'fail',
        message: 'Failed to persist font settings',
        details: error.message
      });
    }

    // Test 8: Background Settings Persistence
    try {
      const backgroundSettings = [
        { setting_key: 'bg_type', setting_value: 'gradient' },
        { setting_key: 'bg_gradient_start', setting_value: '#FF0000' },
        { setting_key: 'bg_gradient_end', setting_value: '#0000FF' },
        { setting_key: 'bg_opacity', setting_value: '0.8' }
      ];

      for (const setting of backgroundSettings) {
        const { error } = await supabase
          .from('app_settings')
          .upsert(setting, { onConflict: 'setting_key' });
        
        if (error) throw error;
      }

      const { data: retrievedBgSettings, error: retrieveError } = await supabase
        .from('app_settings')
        .select('*')
        .in('setting_key', backgroundSettings.map(s => s.setting_key));

      if (retrieveError) throw retrieveError;

      if (retrievedBgSettings.length === backgroundSettings.length) {
        results.push({
          name: 'Background Settings Persistence',
          status: 'pass',
          message: 'Background settings are persisted correctly',
          details: `All ${backgroundSettings.length} background settings saved successfully`
        });
      } else {
        results.push({
          name: 'Background Settings Persistence',
          status: 'warning',
          message: 'Some background settings may not be persisted',
          details: `Expected ${backgroundSettings.length}, got ${retrievedBgSettings.length}`
        });
      }
    } catch (error: any) {
      results.push({
        name: 'Background Settings Persistence',
        status: 'fail',
        message: 'Failed to persist background settings',
        details: error.message
      });
    }

    setTestResults(results);
    setIsRunning(false);

    // Show summary toast
    const passCount = results.filter(r => r.status === 'pass').length;
    const failCount = results.filter(r => r.status === 'fail').length;
    const warningCount = results.filter(r => r.status === 'warning').length;

    toast({
      title: "Test Results",
      description: `${passCount} passed, ${failCount} failed, ${warningCount} warnings`,
      variant: failCount > 0 ? "destructive" : "default"
    });
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'fail':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    const variants = {
      pass: 'bg-green-100 text-green-800',
      fail: 'bg-red-100 text-red-800',
      warning: 'bg-yellow-100 text-yellow-800'
    };
    
    return (
      <Badge className={`${variants[status]} text-xs`}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const tabs = [
    { id: 'test', label: 'Test Results', icon: Settings },
    { id: 'theme', label: 'Theme Customization', icon: Settings },
    { id: 'font', label: 'Font Manager', icon: Type },
    { id: 'background', label: 'Background Manager', icon: Image },
    { id: 'database', label: 'Database Test', icon: Database }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-wedding-navy">Theme System Testing</h1>
        <Button onClick={runTests} disabled={isRunning}>
          {isRunning ? 'Running Tests...' : 'Run All Tests'}
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-wedding-navy text-wedding-navy'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Test Results Tab */}
      {activeTab === 'test' && (
        <div className="space-y-4">
          {testResults.length === 0 && !isRunning && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Click "Run All Tests" to begin testing the theme customization and font management systems.
              </AlertDescription>
            </Alert>
          )}

          {isRunning && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Running comprehensive tests on theme customization, font management, and background systems...
              </AlertDescription>
            </Alert>
          )}

          {testResults.map((result, index) => (
            <Card key={index} className="glass-card">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {getStatusIcon(result.status)}
                    {result.name}
                  </CardTitle>
                  {getStatusBadge(result.status)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">{result.message}</p>
                {result.details && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs font-mono text-gray-500">{result.details}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {testResults.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Test Summary</h3>
              <div className="flex gap-4 text-sm">
                <span className="text-green-600">
                  ✓ {testResults.filter(r => r.status === 'pass').length} Passed
                </span>
                <span className="text-red-600">
                  ✗ {testResults.filter(r => r.status === 'fail').length} Failed
                </span>
                <span className="text-yellow-600">
                  ⚠ {testResults.filter(r => r.status === 'warning').length} Warnings
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Component Tabs */}
      {activeTab === 'theme' && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Theme Customization Component</CardTitle>
          </CardHeader>
          <CardContent>
            <ThemeCustomization />
          </CardContent>
        </Card>
      )}

      {activeTab === 'font' && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Font Manager Component</CardTitle>
          </CardHeader>
          <CardContent>
            <FontManager />
          </CardContent>
        </Card>
      )}

      {activeTab === 'background' && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Background Manager Component</CardTitle>
          </CardHeader>
          <CardContent>
            <BackgroundManager />
          </CardContent>
        </Card>
      )}

      {activeTab === 'database' && (
        <DatabaseTest />
      )}
    </div>
  );
};

export default ThemeSystemTest;