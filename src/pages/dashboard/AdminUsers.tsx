import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, UserPlus, Settings, Activity, Search, Filter, MoreHorizontal } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  display_name: string | null;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
  role: 'guest' | 'admin' | 'couple';
}

const AdminUsers: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles (
            role
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedUsers: User[] = data?.map(profile => ({
        id: profile.id,
        email: profile.email,
        display_name: profile.display_name,
        first_name: profile.first_name,
        last_name: profile.last_name,
        created_at: profile.created_at,
        role: (profile.user_roles as any)?.[0]?.role || 'guest'
      })) || [];

      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
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

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const stats = [
    { label: 'Total Users', value: users.length, icon: Users },
    { label: 'Admins', value: users.filter(u => u.role === 'admin').length, icon: Settings },
    { label: 'Couples', value: users.filter(u => u.role === 'couple').length, icon: UserPlus },
    { label: 'Guests', value: users.filter(u => u.role === 'guest').length, icon: Activity },
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
          <p className="text-sm text-[#7a736b]">Manage user roles and permissions</p>
        </div>
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