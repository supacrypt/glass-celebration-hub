import React from 'react';

interface RSVPsTabProps {
  userRole: 'guest' | 'admin' | 'couple';
  onNavigate: (path: string) => void;
}

const RSVPsTab: React.FC<RSVPsTabProps> = ({ userRole, onNavigate }) => {
  const buttonStyle = {
    boxShadow: `
      5px 5px 10px rgba(163, 155, 146, 0.3),
      -5px -5px 10px rgba(255, 255, 255, 0.6)
    `
  };

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-[#2d3f51]">
        {userRole === 'admin' ? 'RSVP Management' : 'RSVP Status'}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {userRole === 'admin' ? (
          <>
            <button
              onClick={() => onNavigate('/dashboard/rsvps')}
              className="p-3 bg-gradient-to-br from-[#e8e0d7] to-[#f5ede4] rounded-xl text-sm font-medium text-[#5a5651] hover:scale-105 transition-transform"
              style={buttonStyle}
            >
              View All RSVPs
            </button>
            <button
              onClick={() => onNavigate('/dashboard/rsvps/export')}
              className="p-3 bg-gradient-to-br from-[#e8e0d7] to-[#f5ede4] rounded-xl text-sm font-medium text-[#5a5651] hover:scale-105 transition-transform"
              style={buttonStyle}
            >
              Export Guest Data
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onNavigate('/rsvp')}
              className="p-3 bg-gradient-to-br from-[#e8e0d7] to-[#f5ede4] rounded-xl text-sm font-medium text-[#5a5651] hover:scale-105 transition-transform"
              style={buttonStyle}
            >
              Update RSVP
            </button>
            <button
              onClick={() => onNavigate('/rsvp/status')}
              className="p-3 bg-gradient-to-br from-[#e8e0d7] to-[#f5ede4] rounded-xl text-sm font-medium text-[#5a5651] hover:scale-105 transition-transform"
              style={buttonStyle}
            >
              View Status
            </button>
          </>
        )}
      </div>
      <div className="text-xs text-[#7a736b] bg-white/30 p-3 rounded-xl">
        {userRole === 'admin'
          ? 'View RSVP responses, manage guest lists, track attendance numbers, and handle guest count management.'
          : 'Update your RSVP status and view event details for the wedding celebration.'
        }
      </div>
    </div>
  );
};

export default RSVPsTab;