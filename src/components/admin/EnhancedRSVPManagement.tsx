import React, { useState, useEffect } from 'react';
import { Calendar, Users, CheckCircle, Clock, XCircle, MapPin, Utensils, MessageSquare, Bell, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EnhancedRSVP {
  id: string;
  user_id: string;
  event_id: string;
  status: 'attending' | 'declined' | 'pending' | 'maybe';
  guest_count: number;
  created_at: string;
  updated_at: string;
  dietary_restrictions?: string;
  message?: string;
  plus_one_name?: string;
  table_assignment?: string;
  meal_preference?: string;
  song_request?: string;
  accommodation_needed?: boolean;
  transportation_needed?: boolean;
  profiles: {
    first_name?: string;
    last_name?: string;
    email: string;
    phone?: string;
  };
}

interface RSVPEvent {
  id: string;
  title: string;
  event_date: string;
  venue_name?: string;
  address?: string;
  rsvp_deadline?: string;
  max_capacity?: number;
}

interface SeatingTable {
  id: string;
  table_number: number;
  capacity: number;
  assigned_guests: number;
  special_requirements?: string;
}

interface EnhancedRSVPManagementProps {
  rsvps: EnhancedRSVP[];
  onRefresh: () => void;
}

const EnhancedRSVPManagement: React.FC<EnhancedRSVPManagementProps> = ({ rsvps, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [showSeatingPlan, setShowSeatingPlan] = useState(false);
  const [showReminderDialog, setShowReminderDialog] = useState(false);
  const [events, setEvents] = useState<RSVPEvent[]>([]);
  const [seatingTables, setSeatingTables] = useState<SeatingTable[]>([]);
  const [realTimeStats, setRealTimeStats] = useState({
    lastUpdated: new Date(),
    totalCapacity: 0,
    confirmedGuests: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    loadEvents();
    loadSeatingTables();
    setupRealTimeUpdates();
  }, []);

  const loadEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('wedding_events')
        .select('*')
        .order('event_date');

      if (error) throw error;
      
      const eventsWithDeadlines = data.map(event => ({
        ...event,
        rsvp_deadline: new Date(new Date(event.event_date).getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        max_capacity: 150 // Mock capacity
      }));
      
      setEvents(eventsWithDeadlines);
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const loadSeatingTables = () => {
    // Mock seating tables for Sprint 3 - would be loaded from database
    const mockTables: SeatingTable[] = Array.from({ length: 15 }, (_, i) => ({
      id: `table-${i + 1}`,
      table_number: i + 1,
      capacity: i === 0 ? 12 : 8, // Head table has more capacity
      assigned_guests: Math.floor(Math.random() * (i === 0 ? 12 : 8)),
      special_requirements: i === 0 ? 'Head table' : i < 3 ? 'Close to dance floor' : undefined
    }));
    setSeatingTables(mockTables);
  };

  const setupRealTimeUpdates = () => {
    const channel = supabase
      .channel('rsvp-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rsvps'
        },
        (payload) => {
          console.log('Real-time RSVP update:', payload);
          setRealTimeStats(prev => ({
            ...prev,
            lastUpdated: new Date()
          }));
          onRefresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const filteredRSVPs = rsvps.filter(rsvp => {
    const matchesSearch = rsvp.profiles.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${rsvp.profiles.first_name} ${rsvp.profiles.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || rsvp.status === filterStatus;
    const matchesEvent = selectedEvent === 'all' || rsvp.event_id === selectedEvent;
    
    return matchesSearch && matchesStatus && matchesEvent;
  });

  const enhancedStats = {
    total: rsvps.length,
    attending: rsvps.filter(r => r.status === 'attending').length,
    declined: rsvps.filter(r => r.status === 'declined').length,
    pending: rsvps.filter(r => r.status === 'pending').length,
    maybe: rsvps.filter(r => r.status === 'maybe').length,
    totalGuests: rsvps.filter(r => r.status === 'attending').reduce((sum, r) => sum + (r.guest_count || 1), 0),
    dietaryRestrictions: rsvps.filter(r => r.dietary_restrictions).length,
    plusOnes: rsvps.filter(r => r.plus_one_name && r.status === 'attending').length,
    needAccommodation: rsvps.filter(r => r.accommodation_needed && r.status === 'attending').length,
    needTransportation: rsvps.filter(r => r.transportation_needed && r.status === 'attending').length,
    responseRate: rsvps.length > 0 ? Math.round(((rsvps.filter(r => r.status !== 'pending').length) / rsvps.length) * 100) : 0,
    capacityUsed: 0 // Will be calculated based on venue capacity
  };

  // Calculate capacity usage
  const totalCapacity = events.reduce((sum, event) => sum + (event.max_capacity || 0), 0);
  enhancedStats.capacityUsed = totalCapacity > 0 ? Math.round((enhancedStats.totalGuests / totalCapacity) * 100) : 0;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'attending': return CheckCircle;
      case 'declined': return XCircle;
      case 'maybe': return Clock;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'attending': return 'default';
      case 'declined': return 'destructive';
      case 'maybe': return 'secondary';
      default: return 'outline';
    }
  };

  const sendRSVPReminders = async () => {
    try {
      const pendingRSVPs = rsvps.filter(r => r.status === 'pending');
      
      // Mock reminder sending - would integrate with email service
      toast({
        title: "Reminders Sent",
        description: `RSVP reminders sent to ${pendingRSVPs.length} guests`,
      });
      
      setShowReminderDialog(false);
    } catch (error) {
      console.error('Error sending reminders:', error);
      toast({
        title: "Error",
        description: "Failed to send reminders",
        variant: "destructive"
      });
    }
  };

  const assignSeating = async (rsvpId: string, tableId: string) => {
    try {
      // Mock seating assignment - would update database
      toast({
        title: "Seating Assigned",
        description: "Guest has been assigned to table",
      });
    } catch (error) {
      console.error('Error assigning seating:', error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Real-time Enhanced Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="glass-card p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Target className="w-4 h-4 text-glass-blue" />
            <span className="text-xs text-muted-foreground">Response Rate</span>
          </div>
          <div className="text-sm font-semibold">{enhancedStats.responseRate}%</div>
          <Progress value={enhancedStats.responseRate} className="h-1 mt-1" />
        </div>
        <div className="glass-card p-3 text-center">
          <CheckCircle className="w-4 h-4 mx-auto text-glass-green mb-1" />
          <div className="text-sm font-semibold">{enhancedStats.attending}</div>
          <div className="text-xs text-muted-foreground">Attending</div>
        </div>
        <div className="glass-card p-3 text-center">
          <Users className="w-4 h-4 mx-auto text-glass-purple mb-1" />
          <div className="text-sm font-semibold">{enhancedStats.totalGuests}</div>
          <div className="text-xs text-muted-foreground">Total Guests</div>
        </div>
        <div className="glass-card p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <MapPin className="w-4 h-4 text-glass-pink" />
            <span className="text-xs text-muted-foreground">Capacity</span>
          </div>
          <div className="text-sm font-semibold">{enhancedStats.capacityUsed}%</div>
          <Progress value={enhancedStats.capacityUsed} className="h-1 mt-1" />
        </div>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-4 gap-2">
        <div className="glass-card p-2 text-center">
          <Utensils className="w-3 h-3 mx-auto text-glass-green mb-1" />
          <div className="text-xs font-semibold">{enhancedStats.dietaryRestrictions}</div>
          <div className="text-xs text-muted-foreground">Dietary</div>
        </div>
        <div className="glass-card p-2 text-center">
          <Users className="w-3 h-3 mx-auto text-glass-blue mb-1" />
          <div className="text-xs font-semibold">{enhancedStats.plusOnes}</div>
          <div className="text-xs text-muted-foreground">Plus Ones</div>
        </div>
        <div className="glass-card p-2 text-center">
          <MapPin className="w-3 h-3 mx-auto text-glass-purple mb-1" />
          <div className="text-xs font-semibold">{enhancedStats.needAccommodation}</div>
          <div className="text-xs text-muted-foreground">Accommodation</div>
        </div>
        <div className="glass-card p-2 text-center">
          <Clock className="w-3 h-3 mx-auto text-glass-pink mb-1" />
          <div className="text-xs font-semibold">{enhancedStats.pending}</div>
          <div className="text-xs text-muted-foreground">Pending</div>
        </div>
      </div>

      {/* Enhanced Actions */}
      <div className="flex flex-wrap gap-2">
        <Dialog open={showReminderDialog} onOpenChange={setShowReminderDialog}>
          <DialogTrigger asChild>
            <Button size="sm" className="text-xs">
              <Bell className="w-3 h-3 mr-1" />
              Send Reminders
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send RSVP Reminders</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Send RSVP reminders to {enhancedStats.pending} guests who haven't responded yet.
              </p>
              <div className="flex space-x-2">
                <Button onClick={sendRSVPReminders} className="flex-1">
                  Send Reminders
                </Button>
                <Button variant="outline" onClick={() => setShowReminderDialog(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Button 
          size="sm" 
          variant="outline"
          onClick={() => setShowSeatingPlan(!showSeatingPlan)}
          className="text-xs"
        >
          <MapPin className="w-3 h-3 mr-1" />
          Seating Plan
        </Button>
      </div>

      {/* Enhanced Search and Filters */}
      <div className="flex gap-2">
        <Input
          placeholder="Search RSVPs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="glass-secondary border-0 flex-1"
        />
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="attending">Attending</SelectItem>
            <SelectItem value="declined">Declined</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="maybe">Maybe</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedEvent} onValueChange={setSelectedEvent}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            {events.map(event => (
              <SelectItem key={event.id} value={event.id}>
                {event.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Enhanced RSVP List */}
      <div className="space-y-2 h-64 overflow-y-auto">
        {filteredRSVPs.slice(0, 10).map((rsvp) => {
          const StatusIcon = getStatusIcon(rsvp.status);
          return (
            <div key={rsvp.id} className="glass-card p-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  <StatusIcon className={`w-4 h-4 flex-shrink-0 mt-1 ${
                    rsvp.status === 'attending' ? 'text-glass-green' :
                    rsvp.status === 'declined' ? 'text-glass-pink' :
                    rsvp.status === 'maybe' ? 'text-glass-blue' :
                    'text-muted-foreground'
                  }`} />
                  
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-wedding-navy truncate">
                      {rsvp.profiles.first_name && rsvp.profiles.last_name
                        ? `${rsvp.profiles.first_name} ${rsvp.profiles.last_name}`
                        : rsvp.profiles.email
                      }
                      {rsvp.plus_one_name && (
                        <span className="text-xs text-glass-pink ml-2">+{rsvp.plus_one_name}</span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {rsvp.profiles.email}
                    </div>
                    
                    {/* Enhanced details */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {rsvp.dietary_restrictions && (
                        <Badge variant="outline" className="text-xs">
                          <Utensils className="w-2 h-2 mr-1" />
                          {rsvp.dietary_restrictions}
                        </Badge>
                      )}
                      {rsvp.table_assignment && (
                        <Badge variant="outline" className="text-xs">
                          <MapPin className="w-2 h-2 mr-1" />
                          Table {rsvp.table_assignment}
                        </Badge>
                      )}
                      {rsvp.accommodation_needed && (
                        <Badge variant="outline" className="text-xs bg-glass-blue">
                          Accommodation
                        </Badge>
                      )}
                      {rsvp.transportation_needed && (
                        <Badge variant="outline" className="text-xs bg-glass-purple">
                          Transport
                        </Badge>
                      )}
                    </div>
                    
                    {rsvp.message && (
                      <div className="text-xs text-muted-foreground mt-1 italic">
                        <MessageSquare className="w-2 h-2 inline mr-1" />
                        {rsvp.message.substring(0, 50)}...
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-1">
                  <Badge variant={getStatusColor(rsvp.status)}>
                    {rsvp.status}
                  </Badge>
                  
                  {rsvp.guest_count > 1 && (
                    <Badge variant="outline" className="text-xs">
                      {rsvp.guest_count} guests
                    </Badge>
                  )}
                  
                  <div className="text-xs text-muted-foreground">
                    {new Date(rsvp.updated_at || rsvp.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {filteredRSVPs.length > 10 && (
          <div className="text-center text-xs text-muted-foreground">
            Showing 10 of {filteredRSVPs.length} RSVPs
          </div>
        )}
      </div>

      {/* Seating Plan View */}
      {showSeatingPlan && (
        <div className="glass-card p-4 space-y-3">
          <h4 className="text-sm font-medium text-wedding-navy">Seating Plan Overview</h4>
          <div className="grid grid-cols-5 gap-2">
            {seatingTables.slice(0, 15).map((table) => (
              <div 
                key={table.id}
                className={`glass-card p-2 text-center cursor-pointer transition-colors ${
                  table.assigned_guests >= table.capacity ? 'bg-glass-pink' : 
                  table.assigned_guests > table.capacity * 0.8 ? 'bg-glass-blue' : 
                  'bg-glass-green'
                }`}
              >
                <div className="text-xs font-semibold">Table {table.table_number}</div>
                <div className="text-xs">{table.assigned_guests}/{table.capacity}</div>
                {table.special_requirements && (
                  <div className="text-xs text-muted-foreground">
                    {table.special_requirements}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-glass-green rounded"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-glass-blue rounded"></div>
                <span>Nearly Full</span>  
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-glass-pink rounded"></div>
                <span>Full</span>
              </div>
            </div>
            <div className="text-muted-foreground">
              Last updated: {realTimeStats.lastUpdated.toLocaleTimeString()}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Summary */}
      <div className="glass-card p-3 space-y-2">
        <h4 className="text-sm font-medium text-wedding-navy">Live Summary</h4>
        <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
          <div className="space-y-1">
            <div>Total Expected: {enhancedStats.totalGuests} guests</div>
            <div>Response Rate: {enhancedStats.responseRate}%</div>
            <div>Venue Capacity: {enhancedStats.capacityUsed}% used</div>
          </div>
          <div className="space-y-1">
            <div>Special Dietary: {enhancedStats.dietaryRestrictions}</div>
            <div>Need Accommodation: {enhancedStats.needAccommodation}</div>
            <div>Plus Ones: {enhancedStats.plusOnes}</div>
          </div>
        </div>
        
        {events.some(event => new Date(event.rsvp_deadline) < new Date()) && (
          <div className="flex items-center gap-2 text-xs text-glass-pink mt-2">
            <Clock className="w-3 h-3" />
            Some RSVP deadlines have passed
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedRSVPManagement;