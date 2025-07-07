import React from 'react';

interface UsersTabProps {
  onNavigate: (path: string) => void;
}

const UsersTab: React.FC<UsersTabProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-[#2d3f51]">User Management</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={() => onNavigate('/dashboard/users')}
          className="glass-button p-3 text-sm font-medium text-foreground"
        >
          View All Users
        </button>
        <button
          onClick={() => onNavigate('/dashboard/users/roles')}
          className="glass-button p-3 text-sm font-medium text-foreground"
        >
          Manage Roles
        </button>
      </div>
      <div className="text-xs text-muted-foreground glass-card p-3">
        Manage user roles (guest, admin, couple), track user activity, and handle account management functions.
      </div>
    </div>
  );
};

export default UsersTab;