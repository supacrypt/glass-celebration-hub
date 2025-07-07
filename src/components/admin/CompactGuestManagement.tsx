import React, { useState, useEffect } from 'react';
import { Users, Upload, Download, UserPlus, Search, Mail, Phone, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Guest {
  id: string;
  first_name?: string;
  last_name?: string;
  email: string;
  phone?: string;
  created_at: string;
  role: 'guest' | 'admin' | 'couple';
}

interface CompactGuestManagementProps {
  users: Guest[];
  onRefresh: () => void;
}

const CompactGuestManagement: React.FC<CompactGuestManagementProps> = ({ users, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showBulkImport, setShowBulkImport] = useState(false);
  const [importing, setImporting] = useState(false);
  const { toast } = useToast();

  const [newGuest, setNewGuest] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  });

  const [bulkData, setBulkData] = useState('');

  const filteredGuests = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const guestStats = {
    total: users.length,
    recent: users.filter(u => 
      new Date(u.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length,
    withPhone: users.filter(u => u.phone).length,
    verified: users.filter(u => u.email).length,
  };

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // First create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: newGuest.email,
        email_confirm: true,
        user_metadata: {
          first_name: newGuest.first_name,
          last_name: newGuest.last_name,
          phone: newGuest.phone
        }
      });

      if (authError) throw authError;

      toast({
        title: "Success",
        description: "Guest added successfully",
      });

      setNewGuest({ first_name: '', last_name: '', email: '', phone: '' });
      setShowAddForm(false);
      onRefresh();
    } catch (error) {
      console.error('Error adding guest:', error);
      toast({
        title: "Error",
        description: "Failed to add guest",
        variant: "destructive"
      });
    }
  };

  const handleBulkImport = async () => {
    if (!bulkData.trim()) {
      toast({
        title: "Error",
        description: "Please enter guest data",
        variant: "destructive"
      });
      return;
    }

    setImporting(true);
    try {
      const lines = bulkData.trim().split('\n');
      const guests = lines.map(line => {
        const [first_name, last_name, email, phone] = line.split(',').map(s => s.trim());
        return { first_name, last_name, email, phone };
      }).filter(guest => guest.email);

      let successCount = 0;
      for (const guest of guests) {
        try {
          await supabase.auth.admin.createUser({
            email: guest.email,
            email_confirm: true,
            user_metadata: {
              first_name: guest.first_name,
              last_name: guest.last_name,
              phone: guest.phone
            }
          });
          successCount++;
        } catch (error) {
          console.error(`Failed to add ${guest.email}:`, error);
        }
      }

      toast({
        title: "Success",
        description: `Added ${successCount} of ${guests.length} guests`,
      });

      setBulkData('');
      setShowBulkImport(false);
      onRefresh();
    } catch (error) {
      console.error('Error bulk importing:', error);
      toast({
        title: "Error",
        description: "Failed to import guests",
        variant: "destructive"
      });
    } finally {
      setImporting(false);
    }
  };

  const exportGuestList = () => {
    const csvContent = [
      'First Name,Last Name,Email,Phone,Role,Join Date',
      ...users.map(user => 
        `${user.first_name || ''},${user.last_name || ''},${user.email},${user.phone || ''},${user.role},${new Date(user.created_at).toLocaleDateString()}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'guest-list.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 h-full overflow-y-auto" style={{ maxHeight: '580px' }}>
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="glass-card p-3 text-center">
          <Users className="w-4 h-4 mx-auto text-glass-blue mb-1" />
          <div className="text-sm font-semibold">{guestStats.total}</div>
          <div className="text-xs text-muted-foreground">Total</div>
        </div>
        <div className="glass-card p-3 text-center">
          <Calendar className="w-4 h-4 mx-auto text-glass-green mb-1" />
          <div className="text-sm font-semibold">{guestStats.recent}</div>
          <div className="text-xs text-muted-foreground">Recent</div>
        </div>
        <div className="glass-card p-3 text-center">
          <Phone className="w-4 h-4 mx-auto text-glass-purple mb-1" />
          <div className="text-sm font-semibold">{guestStats.withPhone}</div>
          <div className="text-xs text-muted-foreground">With Phone</div>
        </div>
        <div className="glass-card p-3 text-center">
          <Mail className="w-4 h-4 mx-auto text-glass-pink mb-1" />
          <div className="text-sm font-semibold">{guestStats.verified}</div>
          <div className="text-xs text-muted-foreground">Verified</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button 
          size="sm" 
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-xs"
        >
          <UserPlus className="w-3 h-3 mr-1" />
          Add Guest
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => setShowBulkImport(!showBulkImport)}
          className="text-xs"
        >
          <Upload className="w-3 h-3 mr-1" />
          Bulk Import
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          onClick={exportGuestList}
          className="text-xs"
        >
          <Download className="w-3 h-3 mr-1" />
          Export
        </Button>
      </div>

      {/* Add Guest Form */}
      {showAddForm && (
        <div className="glass-card p-4 space-y-3">
          <h4 className="text-sm font-medium text-wedding-navy">Add New Guest</h4>
          <form onSubmit={handleAddGuest} className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="First name"
                value={newGuest.first_name}
                onChange={(e) => setNewGuest({ ...newGuest, first_name: e.target.value })}
                className="text-sm"
              />
              <Input
                placeholder="Last name"
                value={newGuest.last_name}
                onChange={(e) => setNewGuest({ ...newGuest, last_name: e.target.value })}
                className="text-sm"
              />
            </div>
            <Input
              type="email"
              placeholder="Email address"
              value={newGuest.email}
              onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
              required
              className="text-sm"
            />
            <Input
              type="tel"
              placeholder="Phone number"
              value={newGuest.phone}
              onChange={(e) => setNewGuest({ ...newGuest, phone: e.target.value })}
              className="text-sm"
            />
            <div className="flex space-x-2">
              <Button type="submit" size="sm" className="flex-1">
                Add Guest
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Bulk Import Form */}
      {showBulkImport && (
        <div className="glass-card p-4 space-y-3">
          <h4 className="text-sm font-medium text-wedding-navy">Bulk Import Guests</h4>
          <div className="text-xs text-muted-foreground">
            Format: First Name, Last Name, Email, Phone (one per line)
          </div>
          <Textarea
            placeholder="John, Doe, john@example.com, +1234567890&#10;Jane, Smith, jane@example.com, +0987654321"
            value={bulkData}
            onChange={(e) => setBulkData(e.target.value)}
            className="text-sm min-h-20"
          />
          <div className="flex space-x-2">
            <Button 
              onClick={handleBulkImport}
              disabled={importing}
              size="sm" 
              className="flex-1"
            >
              {importing ? 'Importing...' : 'Import Guests'}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowBulkImport(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search guests..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 glass-secondary border-0 text-sm"
        />
      </div>

      {/* Guest List */}
      <div className="space-y-2">
        {filteredGuests.slice(0, 8).map((guest) => (
          <div key={guest.id} className="glass-card p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <Users className="w-4 h-4 text-glass-blue flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-wedding-navy truncate">
                    {guest.first_name && guest.last_name 
                      ? `${guest.first_name} ${guest.last_name}`
                      : guest.email
                    }
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {guest.email}
                  </div>
                  {guest.phone && (
                    <div className="text-xs text-muted-foreground">
                      {guest.phone}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 flex-shrink-0">
                <Badge variant={guest.role === 'admin' ? 'destructive' : 'secondary'}>
                  {guest.role}
                </Badge>
                <div className="text-xs text-muted-foreground">
                  {new Date(guest.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {filteredGuests.length > 8 && (
          <div className="text-center text-xs text-muted-foreground">
            Showing 8 of {filteredGuests.length} guests
          </div>
        )}
      </div>
    </div>
  );
};

export default CompactGuestManagement;