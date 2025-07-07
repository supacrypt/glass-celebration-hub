import React from 'react';
import { Shield } from 'lucide-react';

interface AccessRestrictedViewProps {
  onClose: () => void;
}

const AccessRestrictedView: React.FC<AccessRestrictedViewProps> = ({ onClose }) => {
  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[998] transition-opacity duration-300"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
        <div 
          className="glass-popup p-8 text-center max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
          <p className="text-muted-foreground mb-4">
            You need proper privileges to access the dashboard.
          </p>
          <button
            onClick={onClose}
            className="glass-button px-4 py-2 text-sm font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default AccessRestrictedView;