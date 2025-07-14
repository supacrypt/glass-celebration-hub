import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, UserPlus, Settings, Activity, Search, Filter, MoreHorizontal } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { GuestMatcher } from '@/utils/guestMatching';

interface User {
  id: string;
  email: string;
  display_name: string | null;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
  role: 'guest' | 'admin' | 'couple';
  guest_list_id?: string;
  guest_name?: string;
}

interface GuestListItem {
  id: string;
  name: string;
  mobile_number: string | null;
  email_address: string | null;
  matched_user_id: string | null;
}

const AdminUsers: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [unlinkedUsers, setUnlinkedUsers] = useState<User[]>([]);
  const [unmatchedGuests, setUnmatchedGuests] = useState<GuestListItem[]>([]);
  const [showLinkingPanel, setShowLinkingPanel] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchUnlinkedData();
  }, []);

  const fetchUsers = async () => {
    try {
      // Get users from auth
      const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error('Failed to get auth users:', authError);
        toast.error('Failed to load users from auth system');
        return;
      }

      // Get user profiles if they exist
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('*');

      // Get guest list data to check for matches
      const { data: guestData } = await supabase
        .from('guest_list')
        .select('id, name, matched_user_id');

      const profileMap = new Map(profileData?.map(p => [p.user_id, p]) || []);
      const guestMap = new Map(guestData?.map(g => [g.matched_user_id, g]) || []);

      const formattedUsers: User[] = authData.users.map((user: any) => {
        const profile = profileMap.get(user.id);
        const guestMatch = guestMap.get(user.id);
        
        return {
          id: user.id,
          email: user.email,
          display_name: user.user_metadata?.display_name || null,
          first_name: user.user_metadata?.first_name || null,
          last_name: user.user_metadata?.last_name || null,
          created_at: user.created_at,
          role: profile?.role || 'guest',
          guest_list_id: guestMatch?.id || null,
          guest_name: guestMatch?.name || null
        };
      });

      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const fetchUnlinkedData = async () => {
    try {
      const [unlinkedUsersData, unmatchedGuestsData] = await Promise.all([
        GuestMatcher.getUnlinkedUsers(),
        GuestMatcher.getUnmatchedGuests()
      ]);
      
      setUnlinkedUsers(unlinkedUsersData);
      setUnmatchedGuests(unmatchedGuestsData);
    } catch (error) {
      console.error('Error fetching unlinked data:', error);
    }
  };

  const updateUserRole = async (userId: string, newRole: 'guest' | 'admin' | 'couple') => {
    try {
      const { error } = await supabase
        .from('user_roles')
        .upsert({ user_id: userId, role: newRole }, { onConflict: 'user_id' });

      if (error) throw error;

      toast.success('User role updated successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const linkUserToGuest = async (userId: string, guestId: string) => {
    try {
      const success = await GuestMatcher.linkUserToGuest(userId, guestId);
      if (success) {
        toast.success('User linked to guest list successfully');
        fetchUsers();
        fetchUnlinkedData();
      } else {
        toast.error('Failed to link user to guest');
      }
    } catch (error) {
      console.error('Error linking user to guest:', error);
      toast.error('Failed to link user to guest');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const stats = [
    { label: 'Total Users', value: users.length, icon: Users },
    { label: 'Linked to Guests', value: users.filter(u => u.guest_list_id).length, icon: UserPlus },
    { label: 'Unlinked Users', value: unlinkedUsers.length, icon: Activity },
    { label: 'Unmatched Guests', value: unmatchedGuests.length, icon: Settings },
  ];

  return (
    <div className="min-h-screen px-5 pt-12 pb-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[#7a736b]" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-[#2d3f51]">User Management</h1>
          <p className="text-sm text-[#7a736b]">Manage user roles and guest list linking</p>
        </div>
        
        <button
          onClick={() => setShowLinkingPanel(!showLinkingPanel)}
          className="px-4 py-2 bg-[#2d3f51] text-white rounded-lg hover:bg-[#2d3f51]/90 transition-colors text-sm"
        >
          {showLinkingPanel ? 'Hide' : 'Show'} Guest Linking
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <GlassCard key={index} className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2d3f51] flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-xl font-semibold text-[#2d3f51]">{stat.value}</div>
                  <div className="text-xs text-[#7a736b]">{stat.label}</div>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Guest Linking Panel */}
      {showLinkingPanel && (
        <GlassCard className="p-6 mb-6">
          <h3 className="text-lg font-semibold text-[#2d3f51] mb-4">Guest List Linking</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Unlinked Users */}
            <div>
              <h4 className="font-medium text-[#2d3f51] mb-3">Unlinked Users ({unlinkedUsers.length})</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {unlinkedUsers.map(user => (
                  <div key={user.id} className="p-3 bg-white/20 rounded-lg">
                    <div className="font-medium text-sm">
                      {user.display_name || `${user.first_name} ${user.last_name}`}
                    </div>
                    <div className="text-xs text-[#7a736b]">{user.email}</div>
                  </div>
                ))}
                {unlinkedUsers.length === 0 && (
                  <div className="text-center text-[#7a736b] text-sm py-4">
                    All users are linked to guest list
                  </div>
                )}
              </div>
            </div>

            {/* Unmatched Guests */}
            <div>
              <h4 className="font-medium text-[#2d3f51] mb-3">Unmatched Guests ({unmatchedGuests.length})</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {unmatchedGuests.map(guest => (
                  <div key={guest.id} className="p-3 bg-white/20 rounded-lg">
                    <div className="font-medium text-sm">{guest.name}</div>
                    <div className="text-xs text-[#7a736b]">
                      {guest.email_address && <div>📧 {guest.email_address}</div>}
                      {guest.mobile_number && <div>📱 {guest.mobile_number}</div>}
                    </div>
                  </div>
                ))}
                {unmatchedGuests.length === 0 && (
                  <div className="text-center text-[#7a736b] text-sm py-4">
                    All guests are matched to users
                  </div>
                )}
              </div>
            </div>
          </div>

          {(unlinkedUsers.length > 0 && unmatchedGuests.length > 0) && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 mb-2">
                <strong>Manual Linking Instructions:</strong>
              </p>
              <p className="text-xs text-blue-600">
                Click on a user in the list below, then use the dropdown to manually link them to a guest from the list above.
              </p>
            </div>
          )}
        </GlassCard>
      )}

      {/* Filters */}
      <GlassCard className="p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#7a736b]" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d3f51]/20 text-[#2d3f51] placeholder-[#7a736b]"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#7a736b]" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 bg-white/20 border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2d3f51]/20 text-[#2d3f51]"
            >
              <option value="all">All Roles</option>
              <option value="guest">Guest</option>
              <option value="admin">Admin</option>
              <option value="couple">Couple</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Users List */}
      <GlassCard className="p-6">
        <h2 className="text-lg font-semibold text-[#2d3f51] mb-4">Users ({filteredUsers.length})</h2>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2d3f51] mx-auto"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-8 text-[#7a736b]">
            No users found matching your criteria.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#2d3f51] flex items-center justify-center">
                    <span className="text-white font-medium">
                      {user.display_name?.[0] || user.first_name?.[0] || user.email[0].toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-[#2d3f51]">
                      {user.display_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unnamed User'}
                    </div>
                    <div className="text-sm text-[#7a736b]">{user.email}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {!user.guest_list_id && (
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          linkUserToGuest(user.id, e.target.value);
                        }
                      }}
                      className="px-3 py-1 bg-blue-50 border border-blue-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-blue-700"
                      defaultValue=""
                    >
                      <option value="">Link to Guest</option>
                      {unmatchedGuests.map(guest => (
                        <option key={guest.id} value={guest.id}>
                          {guest.name}
                        </option>
                      ))}
                    </select>
                  )}
                  
                  {user.guest_list_id && (
                    <span className="px-3 py-1 bg-green-50 border border-green-300 rounded-lg text-sm text-green-700">
                      ✓ Linked
                    </span>
                  )}
                  
                  <select
                    value={user.role}
                    onChange={(e) => updateUserRole(user.id, e.target.value as 'guest' | 'admin' | 'couple')}
                    className="px-3 py-1 bg-white/20 border border-white/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d3f51]/20 text-[#2d3f51]"
                  >
                    <option value="guest">Guest</option>
                    <option value="admin">Admin</option>
                    <option value="couple">Couple</option>
                  </select>
                  
                  <button className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                    <MoreHorizontal className="w-4 h-4 text-[#7a736b]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default AdminUsers;