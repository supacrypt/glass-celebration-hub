import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Calendar, Camera, Gift, Phone } from 'lucide-react';

const GuestDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('rsvp');

  React.useEffect(() => {
    console.log('[GUEST DASHBOARD] Rendered successfully, active tab:', activeTab);
  }, [activeTab]);

  // Force render with fallback content if there are issues
  try {
    return (
    <div className="p-4 sm:p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="rsvp">
            <User className="w-4 h-4 mr-2" />
            My RSVP
          </TabsTrigger>
          <TabsTrigger value="schedule">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule
          </TabsTrigger>
          <TabsTrigger value="gallery">
            <Camera className="w-4 h-4 mr-2" />
            Gallery
          </TabsTrigger>
          <TabsTrigger value="gifts">
            <Gift className="w-4 h-4 mr-2" />
            Gifts
          </TabsTrigger>
          <TabsTrigger value="contact">
            <Phone className="w-4 h-4 mr-2" />
            Contact
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rsvp">
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-semibold">Your RSVP Details</h3>
            <p className="text-muted-foreground mt-2">Content for managing your RSVP will go here.</p>
          </div>
        </TabsContent>

        <TabsContent value="schedule">
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-semibold">Event Schedule</h3>
            <p className="text-muted-foreground mt-2">The full event schedule will be displayed here.</p>
          </div>
        </TabsContent>

        <TabsContent value="gallery">
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-semibold">Photo Gallery</h3>
            <p className="text-muted-foreground mt-2">The photo gallery and upload functionality will be here.</p>
          </div>
        </TabsContent>

        <TabsContent value="gifts">
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-semibold">Gift Registry</h3>
            <p className="text-muted-foreground mt-2">Details and links for the gift registry will be here.</p>
          </div>
        </TabsContent>

        <TabsContent value="contact">
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-semibold">Contact Information</h3>
            <p className="text-muted-foreground mt-2">Important contact details will be listed here.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
  } catch (error) {
    console.error('[GUEST DASHBOARD] Error rendering:', error);
    // Fallback UI
    return (
      <div className="p-4 sm:p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Guest Dashboard</h3>
          <p className="text-muted-foreground">Welcome to your dashboard!</p>
          <div className="mt-4 space-y-2">
            <button className="w-full p-3 bg-gray-100 rounded hover:bg-gray-200">My RSVP</button>
            <button className="w-full p-3 bg-gray-100 rounded hover:bg-gray-200">Event Schedule</button>
            <button className="w-full p-3 bg-gray-100 rounded hover:bg-gray-200">Gallery</button>
          </div>
        </div>
      </div>
    );
  }
};

export default GuestDashboard;
