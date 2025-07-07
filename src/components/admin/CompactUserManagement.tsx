import React, { useState } from 'react';
import { Search, UserCheck, UserX, Crown, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  created_at: string;
  role: 'guest' | 'admin' | 'couple';
}

interface CompactUserManagementProps {
  users: User[];
  onRefresh: () => void;
}

const CompactUserManagement: React.FC<CompactUserManagementProps> = ({ users, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);
  const { toast } = useToast();

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${user.first_name} ${user.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateUserRole = async (userId: string, newRole: 'guest' | 'admin' | 'couple') => {
    setUpdating(userId);
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `User role updated to ${newRole}`,
      });
      onRefresh();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive"
      });
    } finally {
      setUpdating(null);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return Crown;
      case 'couple': return Shield;
      default: return UserCheck;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'couple': return 'default';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 glass-secondary border-0"
        />
      </div>

      {/* User List */}
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {filteredUsers.slice(0, 10).map((user) => {
          const RoleIcon = getRoleIcon(user.role);
          return (
            <div key={user.id} className="glass-card p-3 flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <RoleIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-wedding-navy truncate">
                    {user.first_name && user.last_name 
                      ? `${user.first_name} ${user.last_name}`
                      : user.email
                    }
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 flex-shrink-0">
                <Badge variant={getRoleColor(user.role)}>
                  {user.role}
                </Badge>
                
                {user.role !== 'admin' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateUserRole(user.id, 'admin')}
                    disabled={updating === user.id}
                    className="text-xs px-2 py-1 h-6"
                  >
                    Make Admin
                  </Button>
                )}
                
                {user.role === 'admin' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateUserRole(user.id, 'guest')}
                    disabled={updating === user.id}
                    className="text-xs px-2 py-1 h-6"
                  >
                    Remove Admin
                  </Button>
                )}
              </div>
            </div>
          );
        })}
        
        {filteredUsers.length > 10 && (
          <div className="text-center text-sm text-muted-foreground py-2">
            Showing first 10 of {filteredUsers.length} users
          </div>
        )}
      </div>
    </div>
  );
};

export default CompactUserManagement;