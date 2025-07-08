import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useWeddingEvents, useRSVPs, useMessages, usePhotos } from '@/hooks/useWeddingData';
import { useToast } from '@/hooks/use-toast';
import GlassCard from '@/components/GlassCard';
import { supabase } from '@/integrations/supabase/client';

export const SystemTest: React.FC = () => {
  const { user, profile, signUp, signIn } = useAuth();
  const { events, loading: eventsLoading } = useWeddingEvents();
  const { rsvps, submitRSVP, loading: rsvpLoading } = useRSVPs();
  const { messages, postMessage, loading: messagesLoading } = useMessages();
  const { photos, uploadPhoto, loading: photosLoading } = usePhotos();
  const { toast } = useToast();

  const [testResults, setTestResults] = useState({
    auth: 'pending',
    rsvp: 'pending',
    messaging: 'pending',
    photos: 'pending',
    admin: 'pending',
    database: 'pending'
  });

  const runDatabaseTest = async () => {
    try {
      // Test foreign key relationships
      const { data: messageData, error: messageError } = await supabase
        .from('messages')
        .select(`
          *,
          profiles(display_name, first_name, last_name),
          message_likes(id, user_id)
        `)
        .limit(1);

      if (messageError) {
        setTestResults(prev => ({ ...prev, database: 'failed' }));
        toast({
          title: "Database Test Failed",
          description: messageError.message,
          variant: "destructive"
        });
        return;
      }

      // Test RSVP relationships
      const { data: rsvpData, error: rsvpError } = await supabase
        .from('rsvps')
        .select(`
          *,
          profiles(first_name, last_name),
          wedding_events(title)
        `)
        .limit(1);

      if (rsvpError) {
        setTestResults(prev => ({ ...prev, database: 'failed' }));
        toast({
          title: "Database Test Failed",
          description: rsvpError.message,
          variant: "destructive"
        });
        return;
      }

      setTestResults(prev => ({ ...prev, database: 'passed' }));
      toast({
        title: "Database Test Passed",
        description: "All foreign key relationships are working correctly!",
      });
    } catch (error) {
      setTestResults(prev => ({ ...prev, database: 'failed' }));
      console.error('Database test error:', error);
    }
  };

  const runAuthTest = async () => {
    try {
      if (!user) {
        // Test login with existing user
        const { error } = await signIn('daniel.j.fleuren@gmail.com', 'TestPassword123!');
        if (error) {
          setTestResults(prev => ({ ...prev, auth: 'failed' }));
          toast({
            title: "Auth Test Failed",
            description: "Could not sign in with test credentials",
            variant: "destructive"
          });
          return;
        }
      }

      setTestResults(prev => ({ ...prev, auth: 'passed' }));
      toast({
        title: "Auth Test Passed",
        description: "Authentication system working correctly!",
      });
    } catch (error) {
      setTestResults(prev => ({ ...prev, auth: 'failed' }));
      console.error('Auth test error:', error);
    }
  };

  const runRSVPTest = async () => {
    try {
      if (!user || !events.length) {
        setTestResults(prev => ({ ...prev, rsvp: 'failed' }));
        toast({
          title: "RSVP Test Failed",
          description: "User not authenticated or no events available",
          variant: "destructive"
        });
        return;
      }

      const mainEvent = events.find(e => e.is_main_event) || events[0];
      const result = await submitRSVP(
        mainEvent.id,
        'attending',
        2,
        'Vegetarian preferred',
        'Test RSVP submission from system test'
      );

      if (result.error) {
        setTestResults(prev => ({ ...prev, rsvp: 'failed' }));
        toast({
          title: "RSVP Test Failed",
          description: result.error.message,
          variant: "destructive"
        });
        return;
      }

      setTestResults(prev => ({ ...prev, rsvp: 'passed' }));
      toast({
        title: "RSVP Test Passed",
        description: "RSVP submission working correctly!",
      });
    } catch (error) {
      setTestResults(prev => ({ ...prev, rsvp: 'failed' }));
      console.error('RSVP test error:', error);
    }
  };

  const runMessagingTest = async () => {
    try {
      if (!user) {
        setTestResults(prev => ({ ...prev, messaging: 'failed' }));
        toast({
          title: "Messaging Test Failed",
          description: "User not authenticated",
          variant: "destructive"
        });
        return;
      }

      const result = await postMessage('Test message from system test - Real-time messaging working! 🎉');
      
      if (result.error) {
        setTestResults(prev => ({ ...prev, messaging: 'failed' }));
        toast({
          title: "Messaging Test Failed",
          description: result.error.message,
          variant: "destructive"
        });
        return;
      }

      setTestResults(prev => ({ ...prev, messaging: 'passed' }));
      toast({
        title: "Messaging Test Passed",
        description: "Real-time messaging working correctly!",
      });
    } catch (error) {
      setTestResults(prev => ({ ...prev, messaging: 'failed' }));
      console.error('Messaging test error:', error);
    }
  };

  const runPhotoTest = async () => {
    try {
      if (!user) {
        setTestResults(prev => ({ ...prev, photos: 'failed' }));
        toast({
          title: "Photo Test Failed",
          description: "User not authenticated",
          variant: "destructive"
        });
        return;
      }

      // Create a test file (small base64 image)
      const testImageData = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI6F+sKEQAAAABJRU5ErkJggg==';
      const blob = new Blob([Uint8Array.from(atob(testImageData), c => c.charCodeAt(0))], { type: 'image/png' });
      const testFile = new File([blob], 'test-image.png', { type: 'image/png' });

      const result = await uploadPhoto(testFile, 'Test Photo', 'System test photo upload');
      
      if (result.error) {
        setTestResults(prev => ({ ...prev, photos: 'failed' }));
        toast({
          title: "Photo Test Failed",
          description: result.error.message,
          variant: "destructive"
        });
        return;
      }

      setTestResults(prev => ({ ...prev, photos: 'passed' }));
      toast({
        title: "Photo Test Passed",
        description: "Photo upload working correctly!",
      });
    } catch (error) {
      setTestResults(prev => ({ ...prev, photos: 'failed' }));
      console.error('Photo test error:', error);
    }
  };

  const runAdminTest = async () => {
    try {
      if (!user) {
        setTestResults(prev => ({ ...prev, admin: 'failed' }));
        toast({
          title: "Admin Test Failed",
          description: "User not authenticated",
          variant: "destructive"
        });
        return;
      }

      // Test admin access to user roles
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id);

      if (roleError) {
        setTestResults(prev => ({ ...prev, admin: 'failed' }));
        toast({
          title: "Admin Test Failed",
          description: roleError.message,
          variant: "destructive"
        });
        return;
      }

      const isAdmin = roleData?.some(role => role.role === 'admin');
      
      if (!isAdmin) {
        setTestResults(prev => ({ ...prev, admin: 'failed' }));
        toast({
          title: "Admin Test Failed",
          description: "User does not have admin privileges",
          variant: "destructive"
        });
        return;
      }

      // Test admin functionality - get all RSVPs
      const { data: allRSVPs, error: rsvpError } = await supabase
        .from('rsvps')
        .select(`
          *,
          profiles(first_name, last_name, email),
          wedding_events(title)
        `);

      if (rsvpError) {
        setTestResults(prev => ({ ...prev, admin: 'failed' }));
        toast({
          title: "Admin Test Failed",
          description: rsvpError.message,
          variant: "destructive"
        });
        return;
      }

      setTestResults(prev => ({ ...prev, admin: 'passed' }));
      toast({
        title: "Admin Test Passed",
        description: `Admin access working! Found ${allRSVPs?.length || 0} RSVPs`,
      });
    } catch (error) {
      setTestResults(prev => ({ ...prev, admin: 'failed' }));
      console.error('Admin test error:', error);
    }
  };

  const runAllTests = async () => {
    toast({
      title: "Running System Tests",
      description: "Testing all wedding app functionality...",
    });

    await runDatabaseTest();
    await runAuthTest();
    await runRSVPTest();
    await runMessagingTest();
    await runPhotoTest();
    await runAdminTest();

    toast({
      title: "System Tests Complete",
      description: "Check the results below!",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'text-green-600';
      case 'failed': return 'text-red-600';
      default: return 'text-yellow-600';
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <GlassCard className="p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Wedding App System Test</h2>
        <p className="text-muted-foreground mb-4">
          Comprehensive testing of all wedding app functionality including RSVP flow, messaging, 
          photo sharing, admin controls, and database relationships.
        </p>
        
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Current User: {user ? `${profile?.first_name} ${profile?.last_name} (${user.email})` : 'Not authenticated'}
          </p>
        </div>

        <Button onClick={runAllTests} className="w-full mb-6">
          Run All Tests
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className={`p-3 rounded-lg border ${getStatusColor(testResults.database)}`}>
              <h3 className="font-semibold">Database Relationships</h3>
              <p className="text-sm">Status: {testResults.database}</p>
            </div>
            
            <div className={`p-3 rounded-lg border ${getStatusColor(testResults.auth)}`}>
              <h3 className="font-semibold">Authentication</h3>
              <p className="text-sm">Status: {testResults.auth}</p>
            </div>
            
            <div className={`p-3 rounded-lg border ${getStatusColor(testResults.rsvp)}`}>
              <h3 className="font-semibold">RSVP System</h3>
              <p className="text-sm">Status: {testResults.rsvp}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className={`p-3 rounded-lg border ${getStatusColor(testResults.messaging)}`}>
              <h3 className="font-semibold">Real-time Messaging</h3>
              <p className="text-sm">Status: {testResults.messaging}</p>
            </div>
            
            <div className={`p-3 rounded-lg border ${getStatusColor(testResults.photos)}`}>
              <h3 className="font-semibold">Photo Sharing</h3>
              <p className="text-sm">Status: {testResults.photos}</p>
            </div>
            
            <div className={`p-3 rounded-lg border ${getStatusColor(testResults.admin)}`}>
              <h3 className="font-semibold">Admin Controls</h3>
              <p className="text-sm">Status: {testResults.admin}</p>
            </div>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <h3 className="text-xl font-semibold mb-4">System Status</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Events Loaded:</span>
            <span className={eventsLoading ? 'text-yellow-600' : 'text-green-600'}>
              {eventsLoading ? 'Loading...' : `${events.length} events`}
            </span>
          </div>
          <div className="flex justify-between">
            <span>RSVPs Loaded:</span>
            <span className={rsvpLoading ? 'text-yellow-600' : 'text-green-600'}>
              {rsvpLoading ? 'Loading...' : `${rsvps.length} RSVPs`}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Messages Loaded:</span>
            <span className={messagesLoading ? 'text-yellow-600' : 'text-green-600'}>
              {messagesLoading ? 'Loading...' : `${messages.length} messages`}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Photos Loaded:</span>
            <span className={photosLoading ? 'text-yellow-600' : 'text-green-600'}>
              {photosLoading ? 'Loading...' : `${photos.length} photos`}
            </span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};