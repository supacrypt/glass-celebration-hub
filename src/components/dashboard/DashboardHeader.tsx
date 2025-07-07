import React from 'react';
import { X, Shield, Maximize2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardHeaderProps {
  userRole?: 'guest' | 'admin' | 'couple';
  onClose: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userRole, onClose }) => {
  const navigate = useNavigate();

  const goToFullDashboard = () => {
    onClose();
    navigate('/admin/dashboard');
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-glass-border/50">
      <div className="flex items-center gap-2">
        <Shield className="w-5 h-5 text-wedding-navy" />
        <h2 className="text-lg font-semibold text-wedding-navy">
          {userRole === 'admin' ? 'Admin Control' : 'Dashboard'}
        </h2>
      </div>
      
      <div className="flex items-center gap-2">
        {userRole === 'admin' && (
          <button
            onClick={goToFullDashboard}
            className="glass-button w-8 h-8 rounded-full flex items-center justify-center"
            title="Open full dashboard"
          >
            <Maximize2 className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
        <button
          onClick={onClose}
          className="glass-button w-8 h-8 rounded-full flex items-center justify-center"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;