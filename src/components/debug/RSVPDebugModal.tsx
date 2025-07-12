import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { submitSimpleRSVP } from '@/utils/simpleRsvpService';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, XCircle, User, Database, Settings, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DebugResult {
  step: string;
  status: 'success' | 'error' | 'warning' | 'info';
  message: string;
  data?: any;
}

interface RSVPDebugModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RSVPDebugModal: React.FC<RSVPDebugModalProps> = ({ isOpen, onClose }) => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [debugging, setDebugging] = useState(false);
  const [results, setResults] = useState<DebugResult[]>([]);

  if (!isOpen) return null;

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
        step: '1. Authentication Check',
        status: user ? 'success' : 'error',
        message: user ? `✅ User authenticated: ${user.email}` : '❌ User not authenticated',
        data: { userId: user?.id, email: user?.email }
      });

      if (!user) {
        setDebugging(false);
        return;
      }

      // Step 2: Check user profile
      addResult({
        step: '2. Profile Check',
        status: profile ? 'success' : 'warning',
        message: profile ? '✅ Profile loaded successfully' : '⚠️ Profile not found or loading',
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
          step: '3. Wedding Events Check',
          status: 'error',
          message: `❌ Error fetching events: ${eventsError.message}`,
          data: eventsError
        });
      } else if (!events || events.length === 0) {
        addResult({
          step: '3. Wedding Events Check',
          status: 'error',
          message: '❌ No main wedding events found',
          data: events
        });
      } else {
        addResult({
          step: '3. Wedding Events Check',
          status: 'success',
          message: `✅ Found ${events.length} main event(s)`,
          data: events
        });
      }

      // Step 4: Test profile update permission
      const testUpdate = {
        first_name: profile?.first_name || 'Test',
        last_name: profile?.last_name || 'User',
        updated_at: new Date().toISOString()
      };

      const { error: profileError } = await supabase
        .from('profiles')
        .update(testUpdate)
        .eq('user_id', user.id);

      addResult({
        step: '4. Profile Update Test',
        status: profileError ? 'error' : 'success',
        message: profileError ? `❌ Profile update failed: ${profileError.message}` : '✅ Profile update permission OK',
        data: profileError || 'Profile update successful'
      });

      // Step 5: Test RSVP submission using simple service
      const rsvpResult = await submitSimpleRSVP({
        userId: user.id,
        attendance: 'yes',
        firstName: profile?.first_name || 'Debug',
        lastName: profile?.last_name || 'Test',
        email: user.email || 'debug@test.com'
      });

      addResult({
        step: '5. RSVP Submission Test',
        status: rsvpResult.success ? 'success' : 'error',
        message: rsvpResult.success 
          ? '✅ Simple RSVP submitted successfully' 
          : `❌ Simple RSVP submission failed: ${rsvpResult.error}`,
        data: rsvpResult
      });

      // Step 6: Verify RSVP was saved (if successful)
      if (rsvpResult.success && rsvpResult.rsvpId) {
        const { data: verifyRSVP, error: verifyError } = await supabase
          .from('rsvps')
          .select('*')
          .eq('id', rsvpResult.rsvpId)
          .single();

        addResult({
          step: '6. RSVP Verification',
          status: verifyError ? 'error' : 'success',
          message: verifyError ? `❌ RSVP verification failed: ${verifyError.message}` : '✅ RSVP verified in database',
          data: verifyError || verifyRSVP
        });
      }

      // Step 7: Check user's existing RSVPs
      const { data: userRSVPs, error: userRSVPsError } = await supabase
        .from('rsvps')
        .select(`
          *,
          wedding_events(title, event_date)
        `)
        .eq('user_id', user.id);

      addResult({
        step: '7. Existing RSVPs Check',
        status: userRSVPsError ? 'error' : 'info',
        message: userRSVPsError 
          ? `❌ Error fetching RSVPs: ${userRSVPsError.message}` 
          : `ℹ️ User has ${userRSVPs?.length || 0} existing RSVP(s)`,
        data: userRSVPsError || userRSVPs
      });

    } catch (error) {
      addResult({
        step: 'General Error',
        status: 'error',
        message: `💥 Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`,
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
      case 'success': return 'border-l-green-500 bg-green-50';
      case 'error': return 'border-l-red-500 bg-red-50';
      case 'warning': return 'border-l-yellow-500 bg-yellow-50';
      case 'info': return 'border-l-blue-500 bg-blue-50';
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold">RSVP Debug Tool</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {/* Current User Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg mb-6">
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

            {/* Actions */}
            <div className="flex gap-2 mb-6">
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
                    className={`p-4 border-l-4 rounded-r-lg ${getStatusColor(result.status)}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(result.status)}
                      <span className="font-medium">{result.step}</span>
                    </div>
                    <p className="text-sm mb-2">{result.message}</p>
                    {result.data && (
                      <details className="text-xs">
                        <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                          Show technical details
                        </summary>
                        <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-32">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            )}

            {results.length === 0 && !debugging && (
              <div className="text-center py-8 text-gray-500">
                <Settings className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Click "Start RSVP Debug" to test the RSVP system</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RSVPDebugModal;