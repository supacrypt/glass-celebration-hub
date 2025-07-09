import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { HapticFeedback } from '@/components/mobile/HapticFeedback';
import { useToast } from '@/hooks/use-toast';

interface ServiceWorkerManagerProps {
  onUpdate?: () => void;
}

export const ServiceWorkerManager: React.FC<ServiceWorkerManagerProps> = ({ onUpdate }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [installPromptEvent, setInstallPromptEvent] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => {
          setRegistration(reg);
          
          // Check for updates
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setUpdateAvailable(true);
                  toast({
                    title: "Update Available",
                    description: "A new version of the app is ready to install.",
                  });
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPromptEvent(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for online/offline status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  const handleInstallApp = async () => {
    if (!installPromptEvent) return;

    const result = await installPromptEvent.prompt();
    console.log('Install prompt result:', result);
    
    if (result.outcome === 'accepted') {
      setIsInstallable(false);
      setInstallPromptEvent(null);
      HapticFeedback.notification('success');
      toast({
        title: "App Installed",
        description: "The wedding app has been installed successfully!",
      });
    }
  };

  const handleUpdateApp = () => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      
      // Listen for controlling change and reload
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
      
      setUpdateAvailable(false);
      onUpdate?.();
    }
  };

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <div className="flex items-center space-x-2 p-3 rounded-lg glass-card">
        {isOnline ? (
          <Wifi className="w-5 h-5 text-green-500" />
        ) : (
          <WifiOff className="w-5 h-5 text-red-500" />
        )}
        <span className="text-sm font-medium">
          {isOnline ? 'Connected' : 'Offline Mode'}
        </span>
      </div>

      {/* Install App Button */}
      {isInstallable && (
        <div className="p-4 rounded-lg glass-card border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-wedding-navy">Install Wedding App</h3>
              <p className="text-sm text-gray-600">
                Install the app for a better experience and offline access
              </p>
            </div>
            <Button onClick={handleInstallApp} className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Install</span>
            </Button>
          </div>
        </div>
      )}

      {/* Update Available */}
      {updateAvailable && (
        <div className="p-4 rounded-lg glass-card border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-wedding-navy">Update Available</h3>
              <p className="text-sm text-gray-600">
                A new version is ready with improvements and bug fixes
              </p>
            </div>
            <Button onClick={handleUpdateApp} className="flex items-center space-x-2">
              <RefreshCw className="w-4 h-4" />
              <span>Update</span>
            </Button>
          </div>
        </div>
      )}

      {/* Offline Features */}
      {!isOnline && (
        <div className="p-4 rounded-lg glass-card border border-yellow-200">
          <h3 className="font-semibold text-wedding-navy mb-2">Offline Mode</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>✓ View previously loaded content</p>
            <p>✓ Browse photo gallery</p>
            <p>✓ Read wedding information</p>
            <p>✗ Post new content (will sync when online)</p>
          </div>
        </div>
      )}
    </div>
  );
};