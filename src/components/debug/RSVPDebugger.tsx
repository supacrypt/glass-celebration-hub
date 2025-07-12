import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, XCircle, User, Database, Settings } from 'lucide-react';

interface DebugResult {
  step: string;
  status: 'success' | 'error' | 'warning' | 'info';
  message: string;
  data?: any;
}

const RSVPDebugger: React.FC = () => {
  const { user, profile } = useAuth();
  const [debugging, setDebugging] = useState(false);
  const [results, setResults] = useState<DebugResult[]>([]);
  const [testData, setTestData] = useState({
    attendance: 'yes' as 'yes' | 'no' | 'maybe',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    mobile: '0400000000',
    address: '123 Test Street, Test City, 2000'
  });

  const addResult = (result: DebugResult) => {
    setResults(prev => [...prev, result]);
  };

  const clearResults = () => {
    setResults([]);
  };

  const debugRSVPFlow = async () => {
    setDebugging(true);
    clearResults();

    try {
      // Step 1: Check user authentication
      addResult({
        step: 'Authentication Check',
        status: user ? 'success' : 'error',
        message: user ? `User authenticated: ${user.email}` : 'User not authenticated',
        data: { userId: user?.id, email: user?.email }
      });

      if (!user) {
        setDebugging(false);
        return;
      }

      // Step 2: Check user profile
      addResult({
        step: 'Profile Check',
        status: profile ? 'success' : 'warning',
        message: profile ? 'Profile loaded successfully' : 'Profile not found or loading',
        data: profile
      });

      // Step 3: Check wedding events
      const { data: events, error: eventsError } = await supabase
        .from('wedding_events')
        .select('id, title, is_main_event, event_date')
        .eq('is_main_event', true)
        .order('event_date', { ascending: true });

      if (eventsError) {
        addResult({
          step: 'Wedding Events Check',
          status: 'error',
          message: `Error fetching events: ${eventsError.message}`,
          data: eventsError
        });
      } else if (!events || events.length === 0) {
        addResult({
          step: 'Wedding Events Check',
          status: 'error',
          message: 'No main wedding events found',
          data: events
        });
      } else {
        addResult({
          step: 'Wedding Events Check',
          status: 'success',
          message: `Found ${events.length} main event(s)`,
          data: events
        });
      }

      // Step 4: Test profile update
      const profileUpdate = {
        first_name: testData.firstName,
        last_name: testData.lastName,
        address: testData.address,
        mobile: testData.mobile,
        rsvp_completed: true
      };

      const { error: profileError } = await supabase
        .from('profiles')
        .update(profileUpdate)
        .eq('user_id', user.id);

      addResult({
        step: 'Profile Update Test',
        status: profileError ? 'error' : 'success',
        message: profileError ? `Profile update failed: ${profileError.message}` : 'Profile update successful',
        data: profileError || profileUpdate
      });

      // Step 5: Test safe_upsert_rsvp function
      if (events && events.length > 0) {
        const mainEvent = events[0];
        
        const { data: rsvpData, error: rsvpError } = await supabase
          .rpc('safe_upsert_rsvp', {
            p_user_id: user.id,
            p_event_id: mainEvent.id,
            p_status: testData.attendance === 'yes' ? 'attending' : testData.attendance === 'no' ? 'declined' : 'maybe',
            p_guest_count: testData.attendance === 'yes' ? 1 : 0,
            p_dietary_restrictions: null,
            p_message: `Test RSVP - ${new Date().toISOString()}`
          });

        addResult({
          step: 'RSVP Function Test',
          status: rsvpError ? 'error' : 'success',
          message: rsvpError ? `RSVP function failed: ${rsvpError.message}` : 'RSVP function executed successfully',
          data: rsvpError || { rsvpId: rsvpData, eventId: mainEvent.id }
        });

        // Step 6: Verify RSVP was created/updated
        if (!rsvpError && rsvpData) {
          const { data: verifyRSVP, error: verifyError } = await supabase
            .from('rsvps')
            .select('*')
            .eq('id', rsvpData)
            .single();

          addResult({
            step: 'RSVP Verification',
            status: verifyError ? 'error' : 'success',
            message: verifyError ? `RSVP verification failed: ${verifyError.message}` : 'RSVP verified in database',
            data: verifyError || verifyRSVP
          });
        }
      }

      // Step 7: Check current user's RSVPs
      const { data: userRSVPs, error: userRSVPsError } = await supabase
        .from('rsvps')
        .select(`
          *,
          wedding_events(title, event_date)
        `)
        .eq('user_id', user.id);

      addResult({
        step: 'User RSVPs Check',
        status: userRSVPsError ? 'error' : 'info',
        message: userRSVPsError 
          ? `Error fetching user RSVPs: ${userRSVPsError.message}` 
          : `User has ${userRSVPs?.length || 0} RSVP(s)`,
        data: userRSVPsError || userRSVPs
      });

    } catch (error) {
      addResult({
        step: 'General Error',
        status: 'error',
        message: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        data: error
      });
    } finally {
      setDebugging(false);
    }
  };

  const getStatusIcon = (status: DebugResult['status']) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'info': return <AlertCircle className="w-4 h-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status: DebugResult['status']) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800 border-green-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          RSVP Debug Tool
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current User Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="font-semibold flex items-center gap-2 mb-2">
              <User className="w-4 h-4" />
              Current User
            </h3>
            <p className="text-sm">Email: {user?.email || 'Not authenticated'}</p>
            <p className="text-sm">ID: {user?.id || 'N/A'}</p>
          </div>
          <div>
            <h3 className="font-semibold flex items-center gap-2 mb-2">
              <Database className="w-4 h-4" />
              Profile
            </h3>
            <p className="text-sm">Name: {profile?.first_name} {profile?.last_name}</p>
            <p className="text-sm">RSVP Complete: {profile?.rsvp_completed ? 'Yes' : 'No'}</p>
          </div>
        </div>

        {/* Test Data */}
        <div className="p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold mb-2">Test Data</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            <span>Attendance: {testData.attendance}</span>
            <span>Name: {testData.firstName} {testData.lastName}</span>
            <span>Email: {testData.email}</span>
            <span>Mobile: {testData.mobile}</span>
            <span className="md:col-span-2">Address: {testData.address}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button 
            onClick={debugRSVPFlow}
            disabled={debugging}
            className="flex items-center gap-2"
          >
            {debugging ? 'Running Debug...' : 'Start RSVP Debug'}
          </Button>
          <Button 
            variant="outline"
            onClick={clearResults}
            disabled={debugging}
          >
            Clear Results
          </Button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold">Debug Results</h3>
            {results.map((result, index) => (
              <div 
                key={index}
                className={`p-3 rounded-lg border ${getStatusColor(result.status)}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {getStatusIcon(result.status)}
                  <span className="font-medium">{result.step}</span>
                  <Badge variant="outline" className="ml-auto">
                    {result.status}
                  </Badge>
                </div>
                <p className="text-sm mb-2">{result.message}</p>
                {result.data && (
                  <details className="text-xs">
                    <summary className="cursor-pointer text-gray-600">Show data</summary>
                    <pre className="mt-1 p-2 bg-gray-100 rounded overflow-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RSVPDebugger;