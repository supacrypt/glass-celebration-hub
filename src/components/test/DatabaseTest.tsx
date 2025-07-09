import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Database, Play, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface DatabaseTestResult {
  name: string;
  status: 'success' | 'error' | 'pending';
  message: string;
  data?: any;
}

const DatabaseTest: React.FC = () => {
  const [testResults, setTestResults] = useState<DatabaseTestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [testKey, setTestKey] = useState('test_setting');
  const [testValue, setTestValue] = useState('{"color": "#FF0000", "size": "large"}');
  const { toast } = useToast();

  const runDatabaseTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    const results: DatabaseTestResult[] = [];

    // Test 1: Check table existence and permissions
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('count')
        .limit(1);

      if (error) throw error;

      results.push({
        name: 'Table Access Test',
        status: 'success',
        message: 'Successfully connected to app_settings table',
        data: { accessible: true }
      });
    } catch (error: any) {
      results.push({
        name: 'Table Access Test',
        status: 'error',
        message: `Failed to access app_settings table: ${error.message}`,
        data: { error: error.message }
      });
    }

    // Test 2: Insert/Upsert Test
    try {
      const testSetting = {
        setting_key: testKey,
        setting_value: testValue
      };

      const { data, error } = await supabase
        .from('app_settings')
        .upsert([testSetting])
        .select();

      if (error) throw error;

      results.push({
        name: 'Insert/Upsert Test',
        status: 'success',
        message: 'Successfully inserted/updated test setting',
        data: { inserted: data }
      });
    } catch (error: any) {
      results.push({
        name: 'Insert/Upsert Test',
        status: 'error',
        message: `Failed to insert/update setting: ${error.message}`,
        data: { error: error.message }
      });
    }

    // Test 3: Read Test
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('*')
        .eq('setting_key', testKey)
        .single();

      if (error) throw error;

      const isCorrect = data.setting_value === testValue;
      results.push({
        name: 'Read Test',
        status: isCorrect ? 'success' : 'error',
        message: isCorrect ? 'Successfully read test setting' : 'Read data does not match inserted data',
        data: { read: data, expected: testValue }
      });
    } catch (error: any) {
      results.push({
        name: 'Read Test',
        status: 'error',
        message: `Failed to read setting: ${error.message}`,
        data: { error: error.message }
      });
    }

    // Test 4: Update Test
    try {
      const updatedValue = `{"updated": true, "timestamp": "${new Date().toISOString()}"}`;
      
      const { data, error } = await supabase
        .from('app_settings')
        .update({ setting_value: updatedValue })
        .eq('setting_key', testKey)
        .select();

      if (error) throw error;

      results.push({
        name: 'Update Test',
        status: 'success',
        message: 'Successfully updated test setting',
        data: { updated: data }
      });
    } catch (error: any) {
      results.push({
        name: 'Update Test',
        status: 'error',
        message: `Failed to update setting: ${error.message}`,
        data: { error: error.message }
      });
    }

    // Test 5: List All Settings
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('setting_key, setting_value')
        .order('setting_key');

      if (error) throw error;

      results.push({
        name: 'List All Settings',
        status: 'success',
        message: `Found ${data.length} settings in the database`,
        data: { settings: data }
      });
    } catch (error: any) {
      results.push({
        name: 'List All Settings',
        status: 'error',
        message: `Failed to list settings: ${error.message}`,
        data: { error: error.message }
      });
    }

    // Test 6: JSON Parsing Test
    try {
      const jsonTestValue = JSON.stringify({
        theme: {
          primaryColor: '#2C3E50',
          secondaryColor: '#F5F2ED',
          accentColor: '#EC4899'
        },
        fonts: {
          primary: 'Inter',
          heading: 'Playfair Display'
        }
      });

      const { error: insertError } = await supabase
        .from('app_settings')
        .upsert([{
          setting_key: 'json_test',
          setting_value: jsonTestValue
        }]);

      if (insertError) throw insertError;

      const { data, error: readError } = await supabase
        .from('app_settings')
        .select('setting_value')
        .eq('setting_key', 'json_test')
        .single();

      if (readError) throw readError;

      const parsedValue = JSON.parse(data.setting_value);
      const isValidJSON = parsedValue.theme && parsedValue.fonts;

      results.push({
        name: 'JSON Storage Test',
        status: isValidJSON ? 'success' : 'error',
        message: isValidJSON ? 'Successfully stored and parsed JSON data' : 'JSON parsing failed',
        data: { parsed: parsedValue, original: jsonTestValue }
      });
    } catch (error: any) {
      results.push({
        name: 'JSON Storage Test',
        status: 'error',
        message: `JSON storage test failed: ${error.message}`,
        data: { error: error.message }
      });
    }

    // Test 7: Cleanup Test
    try {
      const { error } = await supabase
        .from('app_settings')
        .delete()
        .in('setting_key', [testKey, 'json_test']);

      if (error) throw error;

      results.push({
        name: 'Cleanup Test',
        status: 'success',
        message: 'Successfully cleaned up test data',
        data: { deleted: [testKey, 'json_test'] }
      });
    } catch (error: any) {
      results.push({
        name: 'Cleanup Test',
        status: 'error',
        message: `Failed to cleanup test data: ${error.message}`,
        data: { error: error.message }
      });
    }

    setTestResults(results);
    setIsRunning(false);

    // Summary toast
    const successCount = results.filter(r => r.status === 'success').length;
    const errorCount = results.filter(r => r.status === 'error').length;
    
    toast({
      title: "Database Tests Complete",
      description: `${successCount} passed, ${errorCount} failed`,
      variant: errorCount > 0 ? "destructive" : "default"
    });
  };

  const getStatusIcon = (status: DatabaseTestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <div className="w-4 h-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Database className="w-6 h-6 text-wedding-navy" />
          <div>
            <h1 className="text-2xl font-bold text-wedding-navy">Database Connection Test</h1>
            <p className="text-muted-foreground">Test app_settings table operations</p>
          </div>
        </div>
        <Button onClick={runDatabaseTests} disabled={isRunning}>
          <Play className="w-4 h-4 mr-2" />
          {isRunning ? 'Running...' : 'Run Tests'}
        </Button>
      </div>

      {/* Test Configuration */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Test Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="testKey">Test Setting Key</Label>
            <Input
              id="testKey"
              value={testKey}
              onChange={(e) => setTestKey(e.target.value)}
              placeholder="test_setting"
            />
          </div>
          <div>
            <Label htmlFor="testValue">Test Setting Value (JSON)</Label>
            <Textarea
              id="testValue"
              value={testValue}
              onChange={(e) => setTestValue(e.target.value)}
              placeholder='{"color": "#FF0000", "size": "large"}'
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      <div className="space-y-4">
        {testResults.map((result, index) => (
          <Card key={index} className="glass-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(result.status)}
                  <CardTitle className="text-base">{result.name}</CardTitle>
                </div>
                <Badge variant={result.status === 'success' ? 'default' : 'destructive'}>
                  {result.status.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">{result.message}</p>
              {result.data && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <pre className="text-xs overflow-x-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {testResults.length === 0 && !isRunning && (
        <Card className="glass-card">
          <CardContent className="text-center py-8">
            <Database className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Click "Run Tests" to test database operations</p>
          </CardContent>
        </Card>
      )}

      {isRunning && (
        <Card className="glass-card">
          <CardContent className="text-center py-8">
            <div className="w-8 h-8 animate-spin rounded-full border-2 border-wedding-navy border-t-transparent mx-auto mb-4" />
            <p className="text-muted-foreground">Running database tests...</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DatabaseTest;