import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Users, Download, Search, Filter, Mail, Phone, CheckCircle, XCircle, Clock, MapPin, MessageSquare, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

type WeddingGuest = Tables<'guests'>;

interface WeddingGuestManagementProps {
  onRefresh: () => void;
}

const WeddingGuestManagement: React.FC<WeddingGuestManagementProps> = memo(({ onRefresh }) => {
  const [guests, setGuests] = useState<WeddingGuest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedGuest, setSelectedGuest] = useState<WeddingGuest | null>(null);
  const [editMode, setEditMode] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchGuests();
  }, [fetchGuests]);

  const fetchGuests = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .order('guest_names');

      if (error) throw error;
      setGuests(data || []);
    } catch (error) {
      console.error('Error fetching guests:', error);
      toast({
        title: "Error",
        description: "Failed to load guest list",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const categories = useMemo(() => 
    Array.from(new Set(guests.map(g => g.category))), 
    [guests]
  );
  
  const filteredGuests = useMemo(() => 
    guests.filter(guest => {
      const matchesSearch = guest.guest_names.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guest.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guest.mobile?.includes(searchTerm);
      
      const matchesCategory = categoryFilter === 'all' || guest.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || guest.rsvp_status === statusFilter;
      
      return matchesSearch && matchesCategory && matchesStatus;
    }),
    [guests, searchTerm, categoryFilter, statusFilter]
  );

  const guestStats = useMemo(() => ({
    total: guests.length,
    totalCount: guests.reduce((sum, g) => sum + g.guest_count, 0),
    attending: guests.filter(g => g.rsvp_status === 'attending').length,
    attendingCount: guests.filter(g => g.rsvp_status === 'attending').reduce((sum, g) => sum + g.rsvp_count, 0),
    declined: guests.filter(g => g.rsvp_status === 'declined').length,
    pending: guests.filter(g => g.rsvp_status === 'pending').length,
    saveTheDateSent: guests.filter(g => g.save_the_date_sent).length,
    invitesSent: guests.filter(g => g.invite_sent).length,
    byCategory: categories.reduce((acc, cat) => ({
      ...acc,
      [cat]: guests.filter(g => g.category === cat).length
    }), {} as Record<string, number>)
  }), [guests, categories]);

  const updateGuest = useCallback(async (guestId: string, updates: Partial<WeddingGuest>) => {
    try {
      const { error } = await supabase
        .from('guests')
        .update(updates)
        .eq('id', guestId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Guest updated successfully",
      });

      fetchGuests();
      setEditMode(false);
      setSelectedGuest(null);
    } catch (error) {
      console.error('Error updating guest:', error);
      toast({
        title: "Error",
        description: "Failed to update guest",
        variant: "destructive"
      });
    }
  }, [toast, fetchGuests]);

  const exportGuestList = useCallback(() => {
    const csvContent = [
      'Guest Names,Count,Mobile,Category,Location,Save the Date Sent,Invite Sent,RSVP Status,RSVP Count,Notes',
      ...filteredGuests.map(guest => 
        `"${guest.guest_names}",${guest.guest_count},"${guest.mobile || ''}","${guest.category}","${guest.location || ''}",${guest.save_the_date_sent},${guest.invite_sent},"${guest.rsvp_status}",${guest.rsvp_count},"${guest.notes || ''}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wedding-guest-list.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }, [filteredGuests]);

  const getStatusIcon = useCallback((status: string) => {
    switch (status) {
      case 'attending': return CheckCircle;
      case 'declined': return XCircle;
      case 'cannot_contact': return Phone;
      default: return Clock;
    }
  }, []);

  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'attending': return 'text-glass-green';
      case 'declined': return 'text-glass-pink';
      case 'cannot_contact': return 'text-glass-purple';
      default: return 'text-glass-blue';
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-navy"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 h-full overflow-y-auto" style={{ maxHeight: '580px' }}>
      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="glass-card p-3 text-center">
          <Users className="w-4 h-4 mx-auto text-glass-blue mb-1" />
          <div className="text-sm font-semibold">{guestStats.total}</div>
          <div className="text-xs text-muted-foreground">Guest Groups</div>
        </div>
        <div className="glass-card p-3 text-center">
          <Users className="w-4 h-4 mx-auto text-glass-green mb-1" />
          <div className="text-sm font-semibold">{guestStats.totalCount}</div>
          <div className="text-xs text-muted-foreground">Total People</div>
        </div>
        <div className="glass-card p-3 text-center">
          <CheckCircle className="w-4 h-4 mx-auto text-glass-green mb-1" />
          <div className="text-sm font-semibold">{guestStats.attendingCount}</div>
          <div className="text-xs text-muted-foreground">Attending</div>
        </div>
        <div className="glass-card p-3 text-center">
          <Mail className="w-4 h-4 mx-auto text-glass-purple mb-1" />
          <div className="text-sm font-semibold">{guestStats.invitesSent}</div>
          <div className="text-xs text-muted-foreground">Invited</div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search guests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 glass-secondary border-0 text-sm"
          />
        </div>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-32 text-xs">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-32 text-xs">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="attending">Attending</SelectItem>
            <SelectItem value="declined">Declined</SelectItem>
            <SelectItem value="cannot_contact">Cannot Contact</SelectItem>
          </SelectContent>
        </Select>

        <Button size="sm" variant="outline" onClick={exportGuestList} className="text-xs">
          <Download className="w-3 h-3 mr-1" />
          Export
        </Button>
      </div>

      {/* Guest List */}
      <div className="space-y-2">
        {filteredGuests.map((guest) => {
          const StatusIcon = getStatusIcon(guest.rsvp_status);
          return (
            <div key={guest.id} className="glass-card p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <StatusIcon className={`w-4 h-4 flex-shrink-0 ${getStatusColor(guest.rsvp_status)}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-wedding-navy truncate">
                      {guest.guest_names}
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span>{guest.guest_count} people</span>
                      <Badge variant="secondary" className="text-xs">
                        {guest.category}
                      </Badge>
                      {guest.location && (
                        <span className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {guest.location}
                        </span>
                      )}
                    </div>
                    {guest.mobile && (
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Phone className="w-3 h-3 mr-1" />
                        {guest.mobile}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <div className="text-right">
                    <div className="text-xs font-medium">
                      {guest.rsvp_status === 'attending' ? `${guest.rsvp_count} attending` : guest.rsvp_status}
                    </div>
                    <div className="flex space-x-1">
                      {guest.save_the_date_sent && (
                        <Badge variant="outline" className="text-xs">STD</Badge>
                      )}
                      {guest.invite_sent && (
                        <Badge variant="outline" className="text-xs">INV</Badge>
                      )}
                    </div>
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => {setSelectedGuest(guest); setEditMode(false)}}
                        className="text-xs"
                      >
                        <Edit3 className="w-3 h-3" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Guest Details - {guest.guest_names}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        {!editMode ? (
                          <>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <Label className="text-xs font-medium">Guest Count</Label>
                                <div>{guest.guest_count} people</div>
                              </div>
                              <div>
                                <Label className="text-xs font-medium">Category</Label>
                                <div>{guest.category}</div>
                              </div>
                              <div>
                                <Label className="text-xs font-medium">RSVP Status</Label>
                                <div className="flex items-center">
                                  <StatusIcon className={`w-4 h-4 mr-2 ${getStatusColor(guest.rsvp_status)}`} />
                                  {guest.rsvp_status}
                                </div>
                              </div>
                              <div>
                                <Label className="text-xs font-medium">RSVP Count</Label>
                                <div>{guest.rsvp_count}</div>
                              </div>
                            </div>
                            
                            {guest.mobile && (
                              <div>
                                <Label className="text-xs font-medium">Mobile</Label>
                                <div className="text-sm">{guest.mobile}</div>
                              </div>
                            )}
                            
                            {guest.location && (
                              <div>
                                <Label className="text-xs font-medium">Location</Label>
                                <div className="text-sm">{guest.location}</div>
                              </div>
                            )}
                            
                            {guest.notes && (
                              <div>
                                <Label className="text-xs font-medium">Notes</Label>
                                <div className="text-sm">{guest.notes}</div>
                              </div>
                            )}
                            
                            <div className="flex space-x-2">
                              <Button 
                                size="sm" 
                                onClick={() => setEditMode(true)}
                                className="flex-1"
                              >
                                Edit Guest
                              </Button>
                            </div>
                          </>
                        ) : (
                          <EditGuestForm 
                            guest={guest} 
                            onSave={(updates) => updateGuest(guest.id, updates)}
                            onCancel={() => setEditMode(false)}
                          />
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          );
        })}
        
        {filteredGuests.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            No guests found matching your criteria
          </div>
        )}
      </div>
    </div>
  );
});

WeddingGuestManagement.displayName = 'WeddingGuestManagement';

// Edit Guest Form Component
interface EditGuestFormProps {
  guest: WeddingGuest;
  onSave: (updates: Partial<WeddingGuest>) => void;
  onCancel: () => void;
}

const EditGuestForm: React.FC<EditGuestFormProps> = memo(({ guest, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    guest_names: guest.guest_names,
    guest_count: guest.guest_count,
    mobile: guest.mobile || '',
    category: guest.category,
    location: guest.location || '',
    rsvp_status: guest.rsvp_status,
    rsvp_count: guest.rsvp_count,
    notes: guest.notes || '',
    save_the_date_sent: guest.save_the_date_sent,
    invite_sent: guest.invite_sent
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label className="text-xs">Guest Names</Label>
        <Input
          value={formData.guest_names}
          onChange={(e) => setFormData({ ...formData, guest_names: e.target.value })}
          className="text-sm"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">Guest Count</Label>
          <Input
            type="number"
            value={formData.guest_count}
            onChange={(e) => setFormData({ ...formData, guest_count: parseInt(e.target.value) || 0 })}
            className="text-sm"
          />
        </div>
        <div>
          <Label className="text-xs">RSVP Count</Label>
          <Input
            type="number"
            value={formData.rsvp_count}
            onChange={(e) => setFormData({ ...formData, rsvp_count: parseInt(e.target.value) || 0 })}
            className="text-sm"
          />
        </div>
      </div>
      
      <div>
        <Label className="text-xs">Mobile</Label>
        <Input
          value={formData.mobile}
          onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
          className="text-sm"
        />
      </div>
      
      <div>
        <Label className="text-xs">RSVP Status</Label>
        <Select
          value={formData.rsvp_status}
          onValueChange={(value) => setFormData({ ...formData, rsvp_status: value as any })}
        >
          <SelectTrigger className="text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="attending">Attending</SelectItem>
            <SelectItem value="declined">Declined</SelectItem>
            <SelectItem value="cannot_contact">Cannot Contact</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label className="text-xs">Location</Label>
        <Input
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="text-sm"
        />
      </div>
      
      <div>
        <Label className="text-xs">Notes</Label>
        <Textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="text-sm min-h-16"
        />
      </div>
      
      <div className="flex space-x-2">
        <Button type="submit" size="sm" className="flex-1">
          Save Changes
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
});

EditGuestForm.displayName = 'EditGuestForm';

export default WeddingGuestManagement;