import React, { useState } from 'react';
import { runDatabaseDiagnostics, testRSVPSubmission } from '@/utils/diagnostics';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DiagnosticResult {
  success: boolean;
  events?: any[];
  user?: any;
  error?: any;
}

const DatabaseDiagnostics: React.FC = () => {
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [rsvpTest, setRsvpTest] = useState<any>(null);

  const runDiagnostics = async () => {
    setLoading(true);
    try {
      const diagnosticResult = await runDatabaseDiagnostics();
      setResult(diagnosticResult);
    } catch (error) {
      setResult({ success: false, error });
    } finally {
      setLoading(false);
    }
  };

  const testRSVP = async () => {
    if (!result?.events || result.events.length === 0) {
      alert('Please run diagnostics first to get wedding events');
      return;
    }

    setLoading(true);
    try {
      const mainEvent = result.events.find(e => e.is_main_event) || result.events[0];
      const rsvpResult = await testRSVPSubmission(mainEvent.id);
      setRsvpTest(rsvpResult);
    } catch (error) {
      setRsvpTest({ success: false, error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <Card className="bg-white/95 backdrop-blur-sm border shadow-lg">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            🔍 Database Diagnostics
            <Badge variant="secondary">Debug</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={runDiagnostics} 
              disabled={loading}
              size="sm"
              className="flex-1"
            >
              {loading ? 'Running...' : 'Run Diagnostics'}
            </Button>
            <Button 
              onClick={testRSVP} 
              disabled={loading || !result?.success}
              size="sm"
              variant="outline"
            >
              Test RSVP
            </Button>
          </div>

          {result && (
            <div className="text-xs space-y-2">
              <div className="flex items-center gap-2">
                <span>{result.success ? '✅' : '❌'}</span>
                <span className="font-medium">
                  {result.success ? 'Diagnostics Passed' : 'Diagnostics Failed'}
                </span>
              </div>
              
              {result.success && (
                <div className="space-y-1">
                  <div>📧 User: {result.user?.email || 'None'}</div>
                  <div>🎉 Events: {result.events?.length || 0}</div>
                  {result.events && result.events.length > 0 && (
                    <div className="ml-4 space-y-1">
                      {result.events.map((event, idx) => (
                        <div key={idx} className="text-xs">
                          • {event.title} {event.is_main_event ? '(Main)' : ''}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {result.error && (
                <div className="text-red-600 text-xs">
                  Error: {result.error.message || JSON.stringify(result.error)}
                </div>
              )}
            </div>
          )}

          {rsvpTest && (
            <div className="text-xs space-y-2 border-t pt-2">
              <div className="flex items-center gap-2">
                <span>{rsvpTest.success ? '✅' : '❌'}</span>
                <span className="font-medium">
                  {rsvpTest.success ? 'RSVP Test Passed' : 'RSVP Test Failed'}
                </span>
              </div>
              
              {rsvpTest.error && (
                <div className="text-red-600 text-xs">
                  Error: {rsvpTest.error.message || JSON.stringify(rsvpTest.error)}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseDiagnostics;